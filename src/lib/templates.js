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
  },
  
  // NEW TEMPLATES BELOW
  
  {
    id: 'product_requirements',
    icon: 'Box',
    brandColor: '#ec4899',
    title: 'Product Requirements (PRD)',
    desc: 'Define features, user stories, and success metrics.',
    html: `
      <h1>Product Requirements Document</h1>
      <p><strong>Product:</strong> [Product Name] | <strong>Version:</strong> [v1.0] | <strong>Owner:</strong> [PM Name]</p>
      <p><strong>Last Updated:</strong> ${new Date().toLocaleDateString()}</p>

      <blockquote><strong>Executive Summary:</strong> Brief overview of what this product does and why it matters (2-3 sentences).</blockquote>

      <h2>1. Problem Statement</h2>
      <p>What user pain point or business need does this address? Who is affected and how?</p>

      <h2>2. Goals & Success Metrics</h2>
      <table>
        <thead>
          <tr>
            <th>Goal</th>
            <th>Metric</th>
            <th>Target</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Increase user engagement</td>
            <td>Daily Active Users (DAU)</td>
            <td>+25% in Q2</td>
          </tr>
          <tr>
            <td>Reduce churn</td>
            <td>Monthly Retention Rate</td>
            <td>>80%</td>
          </tr>
        </tbody>
      </table>

      <h2>3. User Stories</h2>
      <ul>
        <li><strong>As a</strong> [user type], <strong>I want to</strong> [action], <strong>so that</strong> [benefit].</li>
        <li><strong>As a</strong> developer, <strong>I want to</strong> access API documentation, <strong>so that</strong> I can integrate quickly.</li>
      </ul>

      <h2>4. Functional Requirements</h2>
      <ul data-type="taskList">
        <li data-type="taskItem" data-checked="false"><p>User authentication via OAuth 2.0</p></li>
        <li data-type="taskItem" data-checked="false"><p>Real-time notifications</p></li>
        <li data-type="taskItem" data-checked="false"><p>Export data to CSV/PDF</p></li>
      </ul>

      <h2>5. Non-Functional Requirements</h2>
      <ul>
        <li><strong>Performance:</strong> Page load time < 2 seconds</li>
        <li><strong>Security:</strong> SOC 2 Type II compliance</li>
        <li><strong>Scalability:</strong> Support 100K concurrent users</li>
      </ul>

      <h2>6. Out of Scope</h2>
      <p>Explicitly list what will NOT be included in this release to manage expectations.</p>

      <h2>7. Timeline & Dependencies</h2>
      <p>Key milestones, launch date, and any blockers or cross-team dependencies.</p>
    `
  },
  
  {
    id: 'technical_spec',
    icon: 'Code',
    brandColor: '#06b6d4',
    title: 'Technical Design Doc',
    desc: 'System design, architecture decisions, and implementation plan.',
    html: `
      <h1>Technical Design Specification</h1>
      <p><strong>Feature:</strong> [Feature Name] | <strong>Author:</strong> [Engineer Name] | <strong>Reviewers:</strong> [Names]</p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>

      <blockquote><strong>TL;DR:</strong> One-paragraph summary of what we're building and the chosen approach.</blockquote>

      <h2>1. Background & Context</h2>
      <p>What business problem are we solving? Link to the PRD if available.</p>

      <h2>2. Goals & Non-Goals</h2>
      <p><strong>Goals:</strong></p>
      <ul>
        <li>Build a scalable notification system</li>
        <li>Support email, SMS, and push notifications</li>
      </ul>
      <p><strong>Non-Goals:</strong></p>
      <ul>
        <li>In-app messaging (deferred to v2)</li>
      </ul>

      <h2>3. Proposed Solution</h2>
      <p>High-level description of the technical approach.</p>

      <h3>3.1 Architecture Diagram</h3>
      <pre><code>[API Gateway] → [Message Queue] → [Worker Pool] → [Notification Service]
                                              ↓
                                    [Email/SMS/Push Providers]</code></pre>

      <h3>3.2 Data Model</h3>
      <pre><code>Notification {
  id: UUID
  user_id: UUID
  type: enum (email, sms, push)
  status: enum (pending, sent, failed)
  payload: JSON
  created_at: timestamp
}</code></pre>

      <h2>4. Alternatives Considered</h2>
      <table>
        <thead>
          <tr>
            <th>Approach</th>
            <th>Pros</th>
            <th>Cons</th>
            <th>Decision</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Use third-party service (e.g., Twilio)</td>
            <td>Fast to implement</td>
            <td>Vendor lock-in, cost</td>
            <td>Not chosen</td>
          </tr>
          <tr>
            <td>Build in-house queue system</td>
            <td>Full control, cost-effective</td>
            <td>Maintenance overhead</td>
            <td><strong>Chosen</strong></td>
          </tr>
        </tbody>
      </table>

      <h2>5. API Design</h2>
      <pre><code>POST /api/v1/notifications
{
  "user_id": "123",
  "type": "email",
  "template": "welcome_email",
  "data": { "name": "Alice" }
}</code></pre>

      <h2>6. Error Handling & Edge Cases</h2>
      <ul>
        <li>Retry logic: Exponential backoff (3 retries)</li>
        <li>Dead letter queue for failed messages</li>
        <li>Rate limiting: Max 100 notifications/user/hour</li>
      </ul>

      <h2>7. Testing Strategy</h2>
      <ul data-type="taskList">
        <li data-type="taskItem" data-checked="false"><p>Unit tests for notification handlers</p></li>
        <li data-type="taskItem" data-checked="false"><p>Integration tests with mock providers</p></li>
        <li data-type="taskItem" data-checked="false"><p>Load testing (10K messages/sec)</p></li>
      </ul>

      <h2>8. Deployment & Rollout Plan</h2>
      <p>Phased rollout: 10% → 50% → 100% over 2 weeks. Feature flag: <code>enable_new_notifications</code></p>

      <h2>9. Monitoring & Alerts</h2>
      <ul>
        <li>Metrics: Delivery rate, latency (p50, p99), error rate</li>
        <li>Alerts: Error rate > 5%, queue depth > 10K</li>
      </ul>

      <h2>10. Open Questions</h2>
      <ul>
        <li>Should we support scheduling notifications for future delivery?</li>
        <li>How do we handle user preferences (opt-out)?</li>
      </ul>
    `
  },
  
  {
    id: 'bug_report',
    icon: 'Bug',
    brandColor: '#ef4444',
    title: 'Bug Report',
    desc: 'Track issues with steps to reproduce and severity.',
    html: `
      <h1>Bug Report: [Short Description]</h1>
      <p><strong>Reporter:</strong> [Your Name] | <strong>Date:</strong> ${new Date().toLocaleDateString()} | <strong>Priority:</strong> <strong style="color: #ef4444;">High</strong></p>

      <blockquote><strong>Summary:</strong> Brief one-liner describing the bug.</blockquote>

      <h2>Environment</h2>
      <ul>
        <li><strong>OS:</strong> macOS 13.2 / Windows 11 / Ubuntu 22.04</li>
        <li><strong>Browser:</strong> Chrome 120 / Firefox 121 / Safari 17</li>
        <li><strong>App Version:</strong> v2.3.1</li>
        <li><strong>User Role:</strong> Admin / Standard User</li>
      </ul>

      <h2>Steps to Reproduce</h2>
      <ol>
        <li>Navigate to <code>/dashboard</code></li>
        <li>Click on "Export Report" button</li>
        <li>Select date range: Jan 1 - Jan 31</li>
        <li>Observe error message</li>
      </ol>

      <h2>Expected Behavior</h2>
      <p>The system should generate a CSV file and trigger a download.</p>

      <h2>Actual Behavior</h2>
      <p>Error modal appears: <code>"Export failed: Invalid date format"</code>. No file is downloaded.</p>

      <h2>Screenshots / Logs</h2>
      <p><em>[Attach screenshots or paste error logs here]</em></p>
      <pre><code>Error: Invalid date format at DateParser.parse (line 42)
  at ExportService.generateReport (line 128)</code></pre>

      <h2>Impact</h2>
      <ul>
        <li><strong>Users Affected:</strong> All users with admin role (~500 users)</li>
        <li><strong>Severity:</strong> High (blocks critical workflow)</li>
        <li><strong>Workaround:</strong> Manually query database and export via CLI</li>
      </ul>

      <h2>Proposed Fix</h2>
      <p>Update date parsing logic to handle ISO 8601 format. Add validation on the frontend before submission.</p>
    `
  },
  
  {
    id: 'sprint_retro',
    icon: 'RotateCcw',
    brandColor: '#a855f7',
    title: 'Sprint Retrospective',
    desc: 'Reflect on what went well and areas for improvement.',
    html: `
      <h1>Sprint Retrospective: Sprint #[Number]</h1>
      <p><strong>Team:</strong> [Team Name] | <strong>Date:</strong> ${new Date().toLocaleDateString()} | <strong>Facilitator:</strong> [Name]</p>

      <blockquote><strong>Sprint Goal:</strong> [What was the primary objective for this sprint?]</blockquote>

      <h2>📊 Sprint Metrics</h2>
      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Target</th>
            <th>Actual</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Story Points Committed</td>
            <td>40</td>
            <td>38</td>
          </tr>
          <tr>
            <td>Story Points Completed</td>
            <td>40</td>
            <td>35</td>
          </tr>
          <tr>
            <td>Bugs Fixed</td>
            <td>10</td>
            <td>12</td>
          </tr>
        </tbody>
      </table>

      <h2>✅ What Went Well</h2>
      <ul>
        <li>Team collaboration improved with daily standups</li>
        <li>Successfully shipped user authentication feature</li>
        <li>Reduced technical debt by 15%</li>
      </ul>

      <h2>⚠️ What Could Be Improved</h2>
      <ul>
        <li>Code reviews took longer than expected (avg 2 days)</li>
        <li>Unclear requirements led to 3 stories being pushed to next sprint</li>
        <li>CI/CD pipeline flakiness caused deployment delays</li>
      </ul>

      <h2>💡 Insights & Learnings</h2>
      <ul>
        <li>Invest time in requirement clarification before sprint starts</li>
        <li>Pair programming reduced bug count significantly</li>
        <li>Automated testing caught 80% of issues before QA</li>
      </ul>

      <h2>🎯 Action Items for Next Sprint</h2>
      <ul data-type="taskList">
        <li data-type="taskItem" data-checked="false"><p>Set up SLA for code reviews (max 24 hours)</p></li>
        <li data-type="taskItem" data-checked="false"><p>Conduct pre-sprint grooming session with stakeholders</p></li>
        <li data-type="taskItem" data-checked="false"><p>Fix flaky CI tests in the build pipeline</p></li>
        <li data-type="taskItem" data-checked="false"><p>Schedule knowledge-sharing session on new auth system</p></li>
      </ul>

      <h2>📝 Additional Notes</h2>
      <p>Team morale is high. Looking forward to next sprint with renewed focus on quality over velocity.</p>
    `
  },
  
  {
    id: 'business_proposal',
    icon: 'Briefcase',
    brandColor: '#14b8a6',
    title: 'Business Proposal',
    desc: 'Pitch a project with budget, timeline, and ROI.',
    html: `
      <h1>Business Proposal: [Project Name]</h1>
      <p><strong>Submitted by:</strong> [Your Name] | <strong>Department:</strong> [Department] | <strong>Date:</strong> ${new Date().toLocaleDateString()}</p>

      <blockquote><strong>Executive Summary:</strong> A concise overview of the proposal, key benefits, and the ask (e.g., budget, resources). Keep it to 3-4 sentences.</blockquote>

      <h2>1. Problem Statement</h2>
      <p>What business challenge or opportunity does this proposal address? Quantify the impact if possible (e.g., "We're losing $50K/month due to manual processes").</p>

      <h2>2. Proposed Solution</h2>
      <p>Describe the recommended approach, strategy, or initiative. Explain why this solution is the best fit.</p>

      <h2>3. Benefits & Value Proposition</h2>
      <ul>
        <li><strong>Revenue Impact:</strong> Projected to increase ARR by 20% ($500K annually)</li>
        <li><strong>Cost Savings:</strong> Reduce operational costs by $200K/year</li>
        <li><strong>Efficiency Gains:</strong> Cut processing time from 5 hours to 30 minutes</li>
        <li><strong>Customer Satisfaction:</strong> Improve NPS score by 15 points</li>
      </ul>

      <h2>4. Implementation Plan</h2>
      <table>
        <thead>
          <tr>
            <th>Phase</th>
            <th>Activities</th>
            <th>Duration</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Phase 1: Discovery</td>
            <td>Requirements gathering, stakeholder interviews</td>
            <td>2 weeks</td>
            <td>[Name]</td>
          </tr>
          <tr>
            <td>Phase 2: Development</td>
            <td>Build MVP, integration testing</td>
            <td>8 weeks</td>
            <td>[Name]</td>
          </tr>
          <tr>
            <td>Phase 3: Launch</td>
            <td>Pilot with 10% users, iterate, full rollout</td>
            <td>4 weeks</td>
            <td>[Name]</td>
          </tr>
        </tbody>
      </table>

      <h2>5. Budget & Resources</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Personnel (2 engineers, 1 designer)</td>
            <td>$120,000</td>
          </tr>
          <tr>
            <td>Software licenses & tools</td>
            <td>$15,000</td>
          </tr>
          <tr>
            <td>Marketing & training</td>
            <td>$10,000</td>
          </tr>
          <tr>
            <td><strong>Total</strong></td>
            <td><strong>$145,000</strong></td>
          </tr>
        </tbody>
      </table>

      <h2>6. ROI & Success Metrics</h2>
      <ul>
        <li><strong>Payback Period:</strong> 6 months</li>
        <li><strong>3-Year ROI:</strong> 300% ($1.5M revenue vs $500K investment)</li>
        <li><strong>KPIs:</strong> User adoption rate, revenue per customer, support ticket reduction</li>
      </ul>

      <h2>7. Risks & Mitigation</h2>
      <table>
        <thead>
          <tr>
            <th>Risk</th>
            <th>Impact</th>
            <th>Mitigation Strategy</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Delayed timeline</td>
            <td>Medium</td>
            <td>Build buffer time, agile sprints</td>
          </tr>
          <tr>
            <td>Low user adoption</td>
            <td>High</td>
            <td>User research, beta testing, training</td>
          </tr>
        </tbody>
      </table>

      <h2>8. Next Steps</h2>
      <ul data-type="taskList">
        <li data-type="taskItem" data-checked="false"><p>Secure executive approval by [Date]</p></li>
        <li data-type="taskItem" data-checked="false"><p>Assemble project team</p></li>
        <li data-type="taskItem" data-checked="false"><p>Kick off discovery phase</p></li>
      </ul>
    `
  },
  
  {
    id: 'onboarding_guide',
    icon: 'Users',
    brandColor: '#f97316',
    title: 'Employee Onboarding',
    desc: 'Welcome new hires with tasks, resources, and contacts.',
    html: `
      <h1>Welcome to [Company Name]! 🎉</h1>
      <p><strong>New Hire:</strong> [Employee Name] | <strong>Role:</strong> [Job Title] | <strong>Start Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Manager:</strong> [Manager Name] | <strong>Buddy:</strong> [Buddy Name]</p>

      <blockquote><strong>Welcome Message:</strong> We're thrilled to have you on the team! This guide will help you get up to speed in your first 30 days.</blockquote>

      <h2>Week 1: Orientation & Setup</h2>
      <ul data-type="taskList">
        <li data-type="taskItem" data-checked="false"><p>Complete HR paperwork (benefits, tax forms)</p></li>
        <li data-type="taskItem" data-checked="false"><p>Set up laptop, email, Slack, and dev environment</p></li>
        <li data-type="taskItem" data-checked="false"><p>Attend new hire orientation session</p></li>
        <li data-type="taskItem" data-checked="false"><p>Read company handbook & culture guide</p></li>
        <li data-type="taskItem" data-checked="false"><p>Meet with manager for 1:1 intro</p></li>
        <li data-type="taskItem" data-checked="false"><p>Coffee chat with your onboarding buddy</p></li>
      </ul>

      <h2>Week 2-3: Learning & Exploration</h2>
      <ul data-type="taskList">
        <li data-type="taskItem" data-checked="false"><p>Shadow team members on key workflows</p></li>
        <li data-type="taskItem" data-checked="false"><p>Review product documentation & architecture diagrams</p></li>
        <li data-type="taskItem" data-checked="false"><p>Complete security & compliance training</p></li>
        <li data-type="taskItem" data-checked="false"><p>Join team standup and sprint planning meetings</p></li>
        <li data-type="taskItem" data-checked="false"><p>Pick up first "starter" ticket/task</p></li>
      </ul>

      <h2>Week 4: Ramp-Up & Contributions</h2>
      <ul data-type="taskList">
        <li data-type="taskItem" data-checked="false"><p>Ship first meaningful contribution (PR, feature, doc update)</p></li>
        <li data-type="taskItem" data-checked="false"><p>Schedule 1:1s with cross-functional partners (PM, design, etc.)</p></li>
        <li data-type="taskItem" data-checked="false"><p>Attend team retrospective or all-hands meeting</p></li>
        <li data-type="taskItem" data-checked="false"><p>30-day check-in with manager</p></li>
      </ul>

      <h2>📚 Key Resources</h2>
      <ul>
        <li><strong>Company Wiki:</strong> <a href="#">confluence.company.com</a></li>
        <li><strong>Codebase:</strong> <a href="#">github.com/company/repo</a></li>
        <li><strong>Design System:</strong> <a href="#">figma.com/company-design</a></li>
        <li><strong>Team Slack Channels:</strong> #engineering, #product, #random</li>
      </ul>

      <h2>👥 Key Contacts</h2>
      <table>
        <thead>
          <tr>
            <th>Role</th>
            <th>Name</th>
            <th>Contact</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Manager</td>
            <td>[Manager Name]</td>
            <td>manager@company.com</td>
          </tr>
          <tr>
            <td>HR Partner</td>
            <td>[HR Name]</td>
            <td>hr@company.com</td>
          </tr>
          <tr>
            <td>IT Support</td>
            <td>Help Desk</td>
            <td>helpdesk@company.com</td>
          </tr>
        </tbody>
      </table>

      <h2>💬 FAQ</h2>
      <p><strong>Q: How do I request time off?</strong></p>
      <p>A: Use the HR portal to submit PTO requests. Your manager will approve within 48 hours.</p>

      <p><strong>Q: What's the code review process?</strong></p>
      <p>A: Submit PRs in GitHub, tag 2 reviewers, address feedback, and merge once approved.</p>

      <h2>🎯 30-60-90 Day Goals</h2>
      <ul>
        <li><strong>30 Days:</strong> Understand team dynamics, ship first feature</li>
        <li><strong>60 Days:</strong> Own a small project end-to-end</li>
        <li><strong>90 Days:</strong> Contribute to sprint planning and mentor new hires</li>
      </ul>
    `
  },
  
  {
    id: 'user_guide',
    icon: 'BookOpen',
    brandColor: '#0ea5e9',
    title: 'User Guide / Manual',
    desc: 'Step-by-step instructions for end users.',
    html: `
      <h1>User Guide: [Product/Feature Name]</h1>
      <p><strong>Version:</strong> 1.0 | <strong>Last Updated:</strong> ${new Date().toLocaleDateString()}</p>

      <blockquote><strong>Overview:</strong> This guide will walk you through [Product Name] features and how to get the most out of it.</blockquote>

      <h2>1. Getting Started</h2>
      
      <h3>1.1 System Requirements</h3>
      <ul>
        <li><strong>Browser:</strong> Chrome 100+, Firefox 95+, Safari 15+</li>
        <li><strong>Internet:</strong> Minimum 5 Mbps connection</li>
        <li><strong>Account:</strong> Active subscription (Free, Pro, or Enterprise)</li>
      </ul>

      <h3>1.2 Creating Your Account</h3>
      <ol>
        <li>Visit <code>app.example.com/signup</code></li>
        <li>Enter your email and create a password (min 8 characters)</li>
        <li>Verify your email via the confirmation link</li>
        <li>Complete your profile with name and company info</li>
      </ol>

      <h2>2. Dashboard Overview</h2>
      <p>When you log in, you'll see the main dashboard with these sections:</p>
      <ul>
        <li><strong>Left Sidebar:</strong> Navigation menu (Home, Projects, Settings)</li>
        <li><strong>Main Area:</strong> Your active projects and recent activity</li>
        <li><strong>Top Bar:</strong> Search, notifications, and user profile</li>
      </ul>

      <h2>3. Key Features</h2>

      <h3>3.1 Creating a New Project</h3>
      <ol>
        <li>Click the <strong>"+ New Project"</strong> button in the top right</li>
        <li>Enter a project name and optional description</li>
        <li>Choose a template or start from scratch</li>
        <li>Click <strong>"Create"</strong></li>
      </ol>

      <h3>3.2 Collaborating with Team Members</h3>
      <ol>
        <li>Open a project</li>
        <li>Click <strong>"Share"</strong> in the top right</li>
        <li>Enter email addresses and set permissions (Viewer, Editor, Admin)</li>
        <li>Click <strong>"Send Invite"</strong></li>
      </ol>

      <h3>3.3 Exporting Your Work</h3>
      <ol>
        <li>Navigate to <strong>File → Export</strong></li>
        <li>Choose format: PDF, CSV, or JSON</li>
        <li>Click <strong>"Download"</strong></li>
      </ol>

      <h2>4. Tips & Best Practices</h2>
      <ul>
        <li>Use keyboard shortcuts for faster workflows (<code>Cmd/Ctrl + K</code> for search)</li>
        <li>Enable auto-save in Settings to prevent data loss</li>
        <li>Tag projects for easy filtering and organization</li>
        <li>Set up webhooks to integrate with other tools (Slack, Trello, etc.)</li>
      </ul>

      <h2>5. Troubleshooting</h2>
      
      <h3>Issue: Can't log in</h3>
      <p><strong>Solution:</strong> Try resetting your password via <strong>"Forgot Password"</strong> link. Clear browser cache if the issue persists.</p>

      <h3>Issue: Project not saving</h3>
      <p><strong>Solution:</strong> Check your internet connection. If online, try refreshing the page or contact support.</p>

      <h2>6. Support & Resources</h2>
      <ul>
        <li><strong>Help Center:</strong> <a href="#">help.example.com</a></li>
        <li><strong>Video Tutorials:</strong> <a href="#">youtube.com/exampletutorials</a></li>
        <li><strong>Email Support:</strong> support@example.com</li>
        <li><strong>Live Chat:</strong> Available Mon-Fri, 9am-5pm EST</li>
      </ul>
    `
  },
  
  {
    id: 'sop',
    icon: 'ListChecks',
    brandColor: '#84cc16',
    title: 'Standard Operating Procedure',
    desc: 'Repeatable workflows and compliance guidelines.',
    html: `
      <h1>Standard Operating Procedure (SOP)</h1>
      <p><strong>SOP Title:</strong> [Procedure Name]</p>
      <p><strong>SOP ID:</strong> SOP-[001] | <strong>Version:</strong> 1.0 | <strong>Effective Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Prepared by:</strong> [Your Name] | <strong>Approved by:</strong> [Manager/Director]</p>

      <blockquote><strong>Purpose:</strong> Briefly state why this SOP exists and what process it standardizes (e.g., "To ensure consistent code deployment across all environments").</blockquote>

      <h2>1. Scope</h2>
      <p>This SOP applies to [team/department/role] and covers [process/activity]. It does NOT cover [out-of-scope items].</p>

      <h2>2. Responsibilities</h2>
      <table>
        <thead>
          <tr>
            <th>Role</th>
            <th>Responsibility</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>DevOps Engineer</td>
            <td>Execute deployment scripts, monitor logs</td>
          </tr>
          <tr>
            <td>Tech Lead</td>
            <td>Approve deployment request, verify post-deployment health</td>
          </tr>
          <tr>
            <td>QA Team</td>
            <td>Sign off on release candidate after testing</td>
          </tr>
        </tbody>
      </table>

      <h2>3. Prerequisites</h2>
      <ul data-type="taskList">
        <li data-type="taskItem" data-checked="false"><p>All unit and integration tests pass</p></li>
        <li data-type="taskItem" data-checked="false"><p>Code review completed and approved</p></li>
        <li data-type="taskItem" data-checked="false"><p>Release notes prepared</p></li>
        <li data-type="taskItem" data-checked="false"><p>Stakeholders notified of deployment window</p></li>
      </ul>

      <h2>4. Procedure Steps</h2>

      <h3>Step 1: Pre-Deployment Checks</h3>
      <ol>
        <li>Verify all PR checks are green in GitHub</li>
        <li>Run smoke tests on staging environment</li>
        <li>Create database backup (if applicable)</li>
        <li>Obtain approval from Tech Lead in Slack (#releases channel)</li>
      </ol>

      <h3>Step 2: Deployment</h3>
      <ol>
        <li>Log into deployment server: <code>ssh deploy@prod.example.com</code></li>
        <li>Navigate to project directory: <code>cd /var/www/app</code></li>
        <li>Pull latest code: <code>git pull origin main</code></li>
        <li>Run deployment script: <code>./deploy.sh --env production</code></li>
        <li>Monitor logs in real-time: <code>tail -f /var/log/app.log</code></li>
      </ol>

      <h3>Step 3: Post-Deployment Validation</h3>
      <ol>
        <li>Check application health endpoint: <code>curl https://api.example.com/health</code></li>
        <li>Verify key user flows in production (login, checkout, etc.)</li>
        <li>Monitor error rates in Datadog/Sentry for 15 minutes</li>
        <li>Confirm with QA team that critical paths are functional</li>
      </ol>

      <h3>Step 4: Rollback (if needed)</h3>
      <ol>
        <li>If error rate > 5%, initiate rollback immediately</li>
        <li>Run rollback script: <code>./rollback.sh --to [previous_version]</code></li>
        <li>Notify stakeholders in #incidents channel</li>
        <li>Conduct post-mortem within 48 hours</li>
      </ol>

      <h2>5. Documentation & Records</h2>
      <ul>
        <li>Log all deployments in <strong>Deployment Tracker</strong> spreadsheet</li>
        <li>Save release notes in <code>/docs/releases/</code> folder</li>
        <li>Update status in Jira/Linear (move ticket to "Deployed" column)</li>
      </ul>

      <h2>6. Safety & Compliance</h2>
      <ul>
        <li>Deployments must occur during approved maintenance windows (Tues/Thurs, 10pm-12am EST)</li>
        <li>Follow GDPR/SOC2 data handling guidelines</li>
        <li>Never deploy on Fridays or before holidays</li>
      </ul>

      <h2>7. Review & Updates</h2>
      <p>This SOP will be reviewed quarterly. Submit improvement suggestions to [process owner email].</p>

      <h2>8. Appendix</h2>
      <h3>A. Glossary</h3>
      <ul>
        <li><strong>Rollback:</strong> Reverting to a previous stable version</li>
        <li><strong>Smoke Test:</strong> Quick sanity check of core functionality</li>
      </ul>

      <h3>B. Related Documents</h3>
      <ul>
        <li>Incident Response Plan (SOP-005)</li>
        <li>Database Migration Guide (SOP-012)</li>
      </ul>
    `
  },
  
  {
    id: 'changelog',
    icon: 'GitBranch',
    brandColor: '#6366f1',
    title: 'Changelog / Release Notes',
    desc: 'Track feature releases, bug fixes, and breaking changes.',
    html: `
      <h1>Changelog</h1>
      <p><strong>Product:</strong> [Product Name] | <strong>Maintainer:</strong> [Team Name]</p>

      <blockquote>All notable changes to this project will be documented in this file. The format is based on <a href="https://keepachangelog.com/">Keep a Changelog</a>, and this project adheres to <a href="https://semver.org/">Semantic Versioning</a>.</blockquote>

      <h2>v2.1.0 - ${new Date().toLocaleDateString()}</h2>
      
      <h3>✨ Added</h3>
      <ul>
        <li>New dark mode toggle in user settings</li>
        <li>Export reports to PDF format</li>
        <li>Real-time collaboration indicators (see who's viewing)</li>
        <li>Keyboard shortcuts panel (<code>Cmd/Ctrl + K</code>)</li>
      </ul>

      <h3>🔧 Changed</h3>
      <ul>
        <li>Improved search performance by 40% with new indexing</li>
        <li>Updated UI for notification center (more compact layout)</li>
        <li>Increased file upload limit from 10MB to 50MB</li>
      </ul>

      <h3>🐛 Fixed</h3>
      <ul>
        <li>Resolved issue where date picker showed incorrect timezone</li>
        <li>Fixed crash when exporting large datasets (>10K rows)</li>
        <li>Corrected alignment of buttons on mobile devices</li>
        <li>Patched security vulnerability in OAuth token refresh logic</li>
      </ul>

      <h3> Deprecated</h3>
      <ul>
        <li>Legacy API v1 endpoints will be removed in v3.0 (planned for Q3 2025)</li>
        <li>Old chart library (Chart.js 2.x) replaced with Recharts</li>
      </ul>

      <h3> Removed</h3>
      <ul>
        <li>Discontinued support for Internet Explorer 11</li>
      </ul>

      <hr>

      <h2>v2.0.3 - 2025-03-15</h2>
      
      <h3>Fixed</h3>
      <ul>
        <li>Fixed email notifications not being sent for shared documents</li>
        <li>Resolved memory leak in WebSocket connection handler</li>
      </ul>

      <hr>

      <h2>v2.0.0 - 2025-03-01 </h2>
      
      <h3>✨ Added</h3>
      <ul>
        <li><strong>Major:</strong> Multi-user real-time editing powered by Yjs CRDTs</li>
        <li><strong>Major:</strong> Custom templates library with 15 pre-built templates</li>
        <li>Inline comments and threaded discussions</li>
        <li>Version history with 30-day rollback</li>
        <li>Two-factor authentication (2FA) support</li>
      </ul>

      <h3> Changed</h3>
      <ul>
        <li><strong>Breaking:</strong> API authentication now requires <code>X-API-Version: 2</code> header</li>
        <li><strong>Breaking:</strong> Renamed <code>/api/documents</code> to <code>/api/v2/docs</code></li>
        <li>Redesigned settings page with tabbed navigation</li>
      </ul>

      <h3> Removed</h3>
      <ul>
        <li><strong>Breaking:</strong> Removed legacy XML export format (use JSON instead)</li>
      </ul>

      <h3>Security</h3>
      <ul>
        <li>Upgraded dependencies to patch CVE-2024-1234</li>
        <li>Implemented rate limiting on login endpoints (10 attempts/hour)</li>
      </ul>

      <hr>

      <h2>v1.5.2 - 2025-02-10</h2>
      
      <h3>🐛 Fixed</h3>
      <ul>
        <li>Fixed duplicate notifications bug (#457)</li>
        <li>Corrected API response format for <code>/users/me</code> endpoint</li>
      </ul>

      <hr>

      <h2>Unreleased (Upcoming)</h2>
      <ul>
        <li>Planned: AI-powered content suggestions</li>
        <li Planned: Mobile app (iOS & Android)</li>
        <li>Planned: Integrations with Slack and Microsoft Teams</li>
      </ul>
    `
  }
];

export const getTemplateById = (id) => TEMPLATES.find(t => t.id === id);