const express = require('express');
const axios = require('axios');
const Project = require('../models/Project');
const Endpoint = require('../models/Endpoint');
const { ensureAuthenticated } = require('../middleware/auth');
const router = express.Router();

// @desc    Get all projects owned by the logged-in user
// @route   GET /api/projects
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id }).sort({ createdAt: -1 });
    
    // Enrich projects with endpoint counts
    const enrichedProjects = await Promise.all(projects.map(async (project) => {
      const endpoints = await Endpoint.find({ project: project._id });
      const counts = { REST: 0, gRPC: 0, GraphQL: 0 };
      endpoints.forEach(ep => {
        if (counts[ep.type] !== undefined) {
          counts[ep.type]++;
        }
      });
      return {
        ...project.toObject(),
        endpointCounts: counts,
        totalEndpoints: endpoints.length
      };
    }));

    res.json(enrichedProjects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
  }
});

// @desc    Create a new project
// @route   POST /api/projects
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Project title is required' });
    }

    const project = new Project({
      title,
      description,
      owner: req.user._id
    });

    const savedProject = await project.save();
    res.status(201).json({
      ...savedProject.toObject(),
      endpointCounts: { REST: 0, gRPC: 0, GraphQL: 0 },
      totalEndpoints: 0
    });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create project', error: error.message });
  }
});

// @desc    Get specific project details and all its endpoints
// @route   GET /api/projects/:id
router.get('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const endpoints = await Endpoint.find({ project: project._id }).sort({ createdAt: -1 });
    res.json({
      project,
      endpoints
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch project details', error: error.message });
  }
});

// @desc    Update project metadata
// @route   PUT /api/projects/:id
router.put('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const { title, description } = req.body;
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { title, description },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update project', error: error.message });
  }
});

// @desc    Delete project and its endpoints
// @route   DELETE /api/projects/:id
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Cascade delete all endpoints inside the project
    await Endpoint.deleteMany({ project: project._id });

    res.json({ message: 'Project and all designed endpoints deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete project', error: error.message });
  }
});

// @desc    Create a new endpoint inside a project
// @route   POST /api/projects/:id/endpoints
router.post('/:id/endpoints', ensureAuthenticated, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const endpoint = new Endpoint({
      ...req.body,
      project: project._id
    });

    const savedEndpoint = await endpoint.save();
    res.status(201).json(savedEndpoint);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create endpoint', error: error.message });
  }
});

// @desc    Generate multiple endpoints with AI in one go (does not save to DB, returns list for review)
// @route   POST /api/projects/:id/endpoints/generate-bulk
router.post('/:id/endpoints/generate-bulk', ensureAuthenticated, async (req, res) => {
  try {
    const { prompt, type } = req.body;
    if (!prompt || !type) {
      return res.status(400).json({ message: 'Prompt and type are required' });
    }

    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
    const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b:free';

    if (!OPENROUTER_KEY || OPENROUTER_KEY === 'your_openrouter_api_key_here') {
      // Mocked multiple endpoints generation for demo fallback
      const mockEndpoints = [
        {
          type,
          name: type === 'REST' ? '/api/v1/auth/register' : type === 'GraphQL' ? 'registerUser' : 'Register',
          description: `Register a new user account`,
          restMethod: type === 'REST' ? 'POST' : undefined,
          graphqlType: type === 'GraphQL' ? 'Mutation' : undefined,
          grpcService: type === 'gRPC' ? 'AuthService' : undefined,
          grpcMethodType: type === 'gRPC' ? 'Unary' : undefined,
          requestPayload: type === 'gRPC' ? 'message RegisterRequest {\n  string username = 1;\n  string email = 2;\n  string password = 3;\n}' : '{\n  "username": "string",\n  "email": "string",\n  "password": "secure_password"\n}',
          responsePayload: type === 'gRPC' ? 'message RegisterResponse {\n  string user_id = 1;\n  string token = 2;\n}' : '{\n  "id": "660c6d7a4d57c7c345a30f71",\n  "token": "jwt_token_here"\n}'
        },
        {
          type,
          name: type === 'REST' ? '/api/v1/auth/login' : type === 'GraphQL' ? 'loginUser' : 'Login',
          description: `Authenticate user credentials and return session token`,
          restMethod: type === 'REST' ? 'POST' : undefined,
          graphqlType: type === 'GraphQL' ? 'Mutation' : undefined,
          grpcService: type === 'gRPC' ? 'AuthService' : undefined,
          grpcMethodType: type === 'gRPC' ? 'Unary' : undefined,
          requestPayload: type === 'gRPC' ? 'message LoginRequest {\n  string username = 1;\n  string password = 2;\n}' : '{\n  "username": "string",\n  "password": "password"\n}',
          responsePayload: type === 'gRPC' ? 'message LoginResponse {\n  string token = 1;\n}' : '{\n  "token": "jwt_token_here"\n}'
        }
      ];
      return res.json({ endpoints: mockEndpoints });
    }

    const systemPrompt = `You are "API Architect AI", an expert software system designer.
Your mission is to design a set of relevant API endpoints that fulfill the user's requirements.

The protocol type is: ${type}
User's Overall Requirements:
"${prompt}"

Rules you MUST obey:
1. Design ALL the relevant endpoints required to build the described system. Typically generate between 2 to 5 highly structured endpoints.
2. For each endpoint:
   - For REST, specify an appropriate restMethod (GET, POST, etc.) and a valid path name (e.g. "/api/v1/users").
   - For GraphQL, specify graphqlType (Query, Mutation, Subscription) and a query name.
   - For gRPC, specify grpcService and grpcMethodType, and an RPC method name.
   - Design clean requestPayload and responsePayload formats (JSON strings for REST/GraphQL, protobuf message declarations for gRPC).
3. Respond ONLY with a single JSON object. Output EXACTLY the raw JSON string matching the schema.

The JSON schema you must output is:
{
  "endpoints": [
    {
      "name": "string (path, query name, or method name)",
      "description": "string (clear functional description)",
      "restMethod": "string (REST method, required ONLY for REST)",
      "graphqlType": "string (GraphQL type, required ONLY for GraphQL)",
      "grpcService": "string (gRPC Service name, required ONLY for gRPC)",
      "grpcMethodType": "string (gRPC stream type, required ONLY for gRPC)",
      "requestPayload": "string (JSON or Protobuf string definition)",
      "responsePayload": "string (JSON or Protobuf string definition)"
    }
  ]
}

Generate the JSON response below:`;

    const headers = {
      'Authorization': `Bearer ${OPENROUTER_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
      'X-Title': 'API Vault'
    };

    const openrouterResponse = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: OPENROUTER_MODEL,
      messages: [
        {
          role: 'user',
          content: systemPrompt
        }
      ],
      temperature: 0.2
    }, {
      headers,
      timeout: 120000 // 2 minutes
    });

    const textResponse = openrouterResponse.data.choices[0].message.content.trim();

    const cleanJsonResponse = (rawText) => {
      let cleaned = rawText.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?/, '');
      }
      if (cleaned.endsWith('```')) {
        cleaned = cleaned.replace(/```$/, '');
      }
      return cleaned.trim();
    };

    const parsedData = JSON.parse(cleanJsonResponse(textResponse));
    if (parsedData.endpoints && Array.isArray(parsedData.endpoints)) {
      parsedData.endpoints = parsedData.endpoints.map(ep => ({
        ...ep,
        type
      }));
    }
    res.json(parsedData);
  } catch (error) {
    console.error('AI Bulk Generation Error:', error);
    res.status(500).json({ message: 'Failed to generate endpoints with AI', error: error.message });
  }
});

// @desc    Save multiple endpoints to a project in one go
// @route   POST /api/projects/:id/endpoints/bulk
router.post('/:id/endpoints/bulk', ensureAuthenticated, async (req, res) => {
  try {
    const { endpoints } = req.body;
    if (!endpoints || !Array.isArray(endpoints)) {
      return res.status(400).json({ message: 'Endpoints array is required' });
    }

    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const endpointsToSave = endpoints.map(ep => {
      const cleaned = {
        project: project._id,
        type: ep.type || 'REST',
        name: ep.name || '/api/v1/unknown',
        description: ep.description || '',
        requestPayload: ep.requestPayload || '',
        responsePayload: ep.responsePayload || ''
      };

      if (cleaned.type === 'REST') {
        cleaned.restMethod = (ep.restMethod || 'GET').toUpperCase();
      } else if (cleaned.type === 'GraphQL') {
        cleaned.graphqlType = ep.graphqlType || 'Query';
      } else if (cleaned.type === 'gRPC') {
        cleaned.grpcService = ep.grpcService || 'DefaultService';
        cleaned.grpcMethodType = ep.grpcMethodType || 'Unary';
      }

      return cleaned;
    });

    const savedEndpoints = await Endpoint.insertMany(endpointsToSave);
    res.status(201).json(savedEndpoints);
  } catch (error) {
    res.status(400).json({ message: 'Failed to save endpoints', error: error.message });
  }
});

// @desc    Update designed endpoint details
// @route   PUT /api/endpoints/:id
router.put('/endpoints/:id', ensureAuthenticated, async (req, res) => {
  try {
    // Verify project ownership before editing endpoint
    const endpoint = await Endpoint.findById(req.params.id);
    if (!endpoint) {
      return res.status(404).json({ message: 'Endpoint not found' });
    }

    const project = await Project.findOne({ _id: endpoint.project, owner: req.user._id });
    if (!project) {
      return res.status(403).json({ message: 'Unauthorized modification' });
    }

    const updatedEndpoint = await Endpoint.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedEndpoint);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update endpoint', error: error.message });
  }
});

// @desc    Delete designed endpoint
// @route   DELETE /api/endpoints/:id
router.delete('/endpoints/:id', ensureAuthenticated, async (req, res) => {
  try {
    // Verify project ownership before deleting endpoint
    const endpoint = await Endpoint.findById(req.params.id);
    if (!endpoint) {
      return res.status(404).json({ message: 'Endpoint not found' });
    }

    const project = await Project.findOne({ _id: endpoint.project, owner: req.user._id });
    if (!project) {
      return res.status(403).json({ message: 'Unauthorized delete request' });
    }

    await Endpoint.findByIdAndDelete(req.params.id);
    res.json({ message: 'Endpoint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete endpoint', error: error.message });
  }
});

// @desc    Export project endpoints in specified format (openapi, proto, graphql)
// @route   GET /api/projects/:id/export
router.get('/:id/export', ensureAuthenticated, async (req, res) => {
  try {
    const { format } = req.query;
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const endpoints = await Endpoint.find({ project: project._id });

    if (format === 'openapi') {
      const openapiSpec = {
        openapi: "3.0.0",
        info: {
          title: project.title,
          description: project.description || "Designed REST APIs via API Vault",
          version: "1.0.0"
        },
        paths: {}
      };

      const restEndpoints = endpoints.filter(ep => ep.type === 'REST');
      restEndpoints.forEach(ep => {
        let path = ep.name.trim();
        if (!path.startsWith('/')) {
          path = '/' + path;
        }

        const method = (ep.restMethod || 'GET').toLowerCase();
        if (!openapiSpec.paths[path]) {
          openapiSpec.paths[path] = {};
        }

        const opObj = {
          summary: ep.description || `REST ${ep.restMethod} endpoint`,
          responses: {
            "200": {
              description: "Successful response"
            }
          }
        };

        if (ep.requestPayload && ['post', 'put', 'patch'].includes(method)) {
          try {
            const parsedExample = JSON.parse(ep.requestPayload);
            opObj.requestBody = {
              content: {
                "application/json": {
                  schema: { type: "object" },
                  example: parsedExample
                }
              }
            };
          } catch (e) {
            opObj.requestBody = {
              content: {
                "text/plain": {
                  example: ep.requestPayload
                }
              }
            };
          }
        }

        if (ep.responsePayload) {
          try {
            const parsedRespExample = JSON.parse(ep.responsePayload);
            opObj.responses["200"].content = {
              "application/json": {
                schema: { type: "object" },
                example: parsedRespExample
              }
            };
          } catch (e) {
            opObj.responses["200"].content = {
              "text/plain": {
                example: ep.responsePayload
              }
            };
          }
        }

        openapiSpec.paths[path][method] = opObj;
      });

      res.setHeader('Content-Disposition', `attachment; filename="${project.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_openapi.json"`);
      res.setHeader('Content-Type', 'application/json');
      return res.send(JSON.stringify(openapiSpec, null, 2));
    }

    if (format === 'proto') {
      const grpcEndpoints = endpoints.filter(ep => ep.type === 'gRPC');
      let protoContent = `syntax = "proto3";\n\npackage ${project.title.toLowerCase().replace(/[^a-z0-9]/g, '')};\n\n`;

      const services = {};
      grpcEndpoints.forEach(ep => {
        const sName = ep.grpcService || 'DefaultService';
        if (!services[sName]) {
          services[sName] = [];
        }
        services[sName].push(ep);
      });

      Object.keys(services).forEach(sName => {
        protoContent += `service ${sName} {\n`;
        services[sName].forEach(ep => {
          const reqType = `${ep.name}Request`;
          const respType = `${ep.name}Response`;
          
          let streamModifier = '';
          if (ep.grpcMethodType === 'Client Streaming') {
            streamModifier = 'stream ';
          } else if (ep.grpcMethodType === 'Server Streaming') {
            protoContent += `  rpc ${ep.name} (${reqType}) returns (stream ${respType});\n`;
            return;
          } else if (ep.grpcMethodType === 'Bidirectional Streaming') {
            protoContent += `  rpc ${ep.name} (stream ${reqType}) returns (stream ${respType});\n`;
            return;
          }

          protoContent += `  rpc ${ep.name} (${streamModifier}${reqType}) returns (${respType});\n`;
        });
        protoContent += `}\n\n`;
      });

      grpcEndpoints.forEach(ep => {
        protoContent += `// Payload structures for rpc ${ep.name}\n`;
        if (ep.requestPayload) {
          protoContent += ep.requestPayload + '\n\n';
        } else {
          protoContent += `message ${ep.name}Request {}\n\n`;
        }

        if (ep.responsePayload) {
          protoContent += ep.responsePayload + '\n\n';
        } else {
          protoContent += `message ${ep.name}Response {}\n\n`;
        }
      });

      res.setHeader('Content-Disposition', `attachment; filename="${project.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.proto"`);
      res.setHeader('Content-Type', 'text/plain');
      return res.send(protoContent);
    }

    if (format === 'graphql') {
      const gqlEndpoints = endpoints.filter(ep => ep.type === 'GraphQL');
      const queries = [];
      const mutations = [];
      const subscriptions = [];
      let typesAndSchemas = '';

      gqlEndpoints.forEach(ep => {
        const reqStr = ep.requestPayload ? `# Request Payload Structure:\n# ${ep.requestPayload.replace(/\n/g, '\n# ')}\n` : '';
        const descStr = ep.description ? `  """\n  ${ep.description}\n  """\n` : '';
        
        if (ep.graphqlType === 'Mutation') {
          mutations.push(`${reqStr}${descStr}  ${ep.name}: GraphQLResponse`);
        } else if (ep.graphqlType === 'Subscription') {
          subscriptions.push(`${reqStr}${descStr}  ${ep.name}: GraphQLResponse`);
        } else {
          queries.push(`${reqStr}${descStr}  ${ep.name}: GraphQLResponse`);
        }

        if (ep.responsePayload) {
          typesAndSchemas += `\n# Response payload for ${ep.name}:\n# ${ep.responsePayload.replace(/\n/g, '\n# ')}\n`;
        }
      });

      let sdlContent = `# GraphQL Schema for project: ${project.title}\n\n`;
      sdlContent += `type GraphQLResponse {\n  success: Boolean!\n  message: String\n  data: String\n}\n\n`;

      if (queries.length > 0) {
        sdlContent += `type Query {\n${queries.join('\n\n')}\n}\n\n`;
      }
      if (mutations.length > 0) {
        sdlContent += `type Mutation {\n${mutations.join('\n\n')}\n}\n\n`;
      }
      if (subscriptions.length > 0) {
        sdlContent += `type Subscription {\n${subscriptions.join('\n\n')}\n}\n\n`;
      }

      sdlContent += typesAndSchemas;

      res.setHeader('Content-Disposition', `attachment; filename="${project.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.graphql"`);
      res.setHeader('Content-Type', 'text/plain');
      return res.send(sdlContent);
    }

    res.status(400).json({ message: 'Invalid or missing format parameter.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to export project', error: error.message });
  }
});

module.exports = router;
