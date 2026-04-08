/**
 * templates.js
 * Central source of truth for all document templates.
 */

export const TEMPLATES = [
  {
    id: 'blank',
    icon: 'File',
    brandColor: '#64748b',
    title: 'Blank Document',
    desc: 'Start with a clean slate.',
    html: ''
  },
  {
    id: 'api_docs',
    icon: 'Zap',
    brandColor: '#3b82f6',
    title: 'API Documentation',
    desc: 'Standard endpoint reference with tables and code highlighting.',
    html: `
      <h1>API Reference: [Project Name]</h1>
      <blockquote><strong>Base URL:</strong> <code>https://api.example.com/v1</code></blockquote>
      
      <h2>1. Authentication</h2>
      <p>All endpoints require a Bearer Token in the <code>Authorization</code> header.</p>
      <pre><code>Authorization: Bearer <your_token></code></pre>

      <h2>2. Endpoints</h2>
      
      <h3><code>GET /users</code></h3>
      <p>Retrieve a list of users with optional pagination.</p>
      
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>limit</code></td>
            <td>Integer</td>
            <td>Number of users to return (default: 20)</td>
          </tr>
          <tr>
            <td><code>offset</code></td>
            <td>Integer</td>
            <td>Starting index</td>
          </tr>
        </tbody>
      </table>

      <h3><code>POST /users/login</code></h3>
      <p>Authenticate a user and return a JWT.</p>
      <pre><code>{
  "email": "user@example.com",
  "password": "securepassword"
}</code></pre>
    `
  },
  {
    id: 'research_paper',
    icon: 'GraduationCap',
    brandColor: '#8b5cf6',
    title: 'Research Paper',
    desc: 'Structured academic or whitepaper format.',
    html: `
      <h1>[Title of Research Paper]</h1>
      <p><strong>Authors:</strong> [Names]</p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>

      <blockquote><strong>Abstract:</strong> A brief summary of the research methodology, key findings, and implications. Usually between 150-250 words.</blockquote>

      <h2>1. Introduction</h2>
      <p>State the research problem, objectives, and the significance of the study. Provide background information and context.</p>

      <h2>2. Literature Review</h2>
      <p>Summarize existing research and identify gaps that this study aims to fill.</p>

      <h2>3. Methodology</h2>
      <p>Detailed description of the experimental setup, data collection methods, and analytical techniques used.</p>

      <h2>4. Results</h2>
      <p>Present the findings using data, tables, and charts. Focus on objective facts.</p>

      <h2>5. Discussion</h2>
      <p>Interpret the results, discuss limitations, and compare with previous studies.</p>

      <h2>6. Conclusion</h2>
      <p>Summarize the main contributions and suggest future research directions.</p>
    `
  },
  {
    id: 'project_docs',
    icon: 'ClipboardList',
    brandColor: '#10b981',
    title: 'Project Documentation',
    desc: 'Overview, goals, and architecture for engineering teams.',
    html: `
      <h1>Project Vision & Architecture</h1>
      
      <h2>1. Objective</h2>
      <p>What is the primary "North Star" goal of this project? What problem are we solving?</p>

      <h2>2. Technical Stack</h2>
      <ul data-type="taskList">
        <li data-type="taskItem" data-checked="true"><p>Frontend: React + TipTap</p></li>
        <li data-type="taskItem" data-checked="true"><p>Shared State: Yjs (CRDTs)</p></li>
        <li data-type="taskItem" data-checked="false"><p>Backend: Node.js</p></li>
      </ul>

      <h2>3. System Architecture</h2>
      <p>Describe the high-level services and data flow.</p>
      <pre><code>[Client] <--> [WebSocket] <--> [Yjs Server] <--> [Database]</code></pre>

      <h2>4. Development Roadmap</h2>
      <table>
        <thead>
          <tr>
            <th>Phase</th>
            <th>Task</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>MVP</td>
            <td>Real-time text editing</td>
            <td>Done</td>
          </tr>
          <tr>
            <td>v1.1</td>
            <td>Asset & Template Library</td>
            <td>In Progress</td>
          </tr>
        </tbody>
      </table>
    `
  },
  {
    id: 'meeting_notes',
    icon: 'FileText',
    brandColor: '#f59e0b',
    title: 'Meeting Notes',
    desc: 'Agenda, attendees, and action items.',
    html: `
      <h1>Meeting Notes: [Subject]</h1>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()} | <strong>Facilitator:</strong> [Name]</p>

      <blockquote><strong>Attendees:</strong> @names</blockquote>

      <h2>Agenda</h2>
      <ol>
        <li>Previous Action Items</li>
        <li>Current Status Update</li>
        <li>Blockers & Risks</li>
        <li>New Initiatives</li>
      </ol>

      <h2>Discussion Points</h2>
      <p>Keep notes concise and focus on decisions made.</p>

      <h2>Action Items</h2>
      <ul data-type="taskList">
        <li data-type="taskItem" data-checked="false"><p>Update stakeholders on roadmap</p></li>
        <li data-type="taskItem" data-checked="false"><p>Finalize design for new dashboard</p></li>
        <li data-type="taskItem" data-checked="false"><p>Schedule technical deep-dive</p></li>
      </ul>
    `
  }
];

export const getTemplateById = (id) => TEMPLATES.find(t => t.id === id);
