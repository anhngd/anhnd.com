import NoteContent from './NoteContent'

// Define note type
type Note = {
  id: string
  title: string
  date: string
  excerpt: string
  category: string
  content: string
}

// Generate mock notes data matching the posts on homepage
function generateMockNotes(): Note[] {
  return [
    {
      id: 'building-scalable-systems',
      title: 'Building Scalable Systems',
      date: '2024-01-15',
      excerpt: 'Thoughts on building systems that grow with your business needs.',
      category: 'Engineering',
      content: `
        <h2>Introduction</h2>
        <p>Building scalable systems is one of the most critical challenges in modern software development. As businesses grow, their technical infrastructure must evolve to handle increased load, complexity, and user demands.</p>
        
        <h2>Key Principles</h2>
        <p>When designing scalable systems, there are several fundamental principles to consider:</p>
        <ul>
          <li><strong>Horizontal Scaling:</strong> Design systems that can grow by adding more machines rather than upgrading existing ones.</li>
          <li><strong>Stateless Services:</strong> Keep services stateless to allow easy replication and load distribution.</li>
          <li><strong>Database Optimization:</strong> Use appropriate database strategies including caching, read replicas, and sharding.</li>
          <li><strong>Microservices Architecture:</strong> Break down monolithic applications into smaller, independent services.</li>
        </ul>
        
        <h2>Real-World Applications</h2>
        <p>In my experience working with various systems, I've found that the most successful scalable architectures start with a clear understanding of current needs and future growth projections. It's essential to build for today while keeping tomorrow in mind.</p>
        
        <p>One common mistake is over-engineering from the start. Instead, focus on building a solid foundation that can be extended as requirements evolve. This approach allows teams to deliver value quickly while maintaining flexibility for future scaling needs.</p>
      `
    },
    {
      id: 'data-driven-decision-making',
      title: 'Data-Driven Decision Making',
      date: '2024-01-10',
      excerpt: 'How to leverage data and AI in real-world business scenarios.',
      category: 'Business',
      content: `
        <h2>The Power of Data</h2>
        <p>In today's business landscape, data-driven decision making has become essential for competitive advantage. Organizations that effectively leverage data and AI can make more informed decisions, optimize operations, and create better customer experiences.</p>
        
        <h2>Building a Data Culture</h2>
        <p>Creating a data-driven culture requires more than just tools and technology. It involves:</p>
        <ul>
          <li>Establishing clear data governance policies</li>
          <li>Training teams to ask the right questions</li>
          <li>Building trust in data quality and insights</li>
          <li>Encouraging experimentation and learning from failures</li>
        </ul>
        
        <h2>AI Integration</h2>
        <p>Artificial Intelligence has transformed how we process and analyze data. From predictive analytics to automated decision-making, AI enables businesses to:</p>
        <ul>
          <li>Identify patterns that humans might miss</li>
          <li>Process large volumes of data in real-time</li>
          <li>Personalize experiences at scale</li>
          <li>Automate routine decision-making processes</li>
        </ul>
        
        <h2>Practical Implementation</h2>
        <p>Start small with clear, measurable objectives. Focus on high-impact areas where data can provide immediate value. As you build confidence and capability, gradually expand your data initiatives across the organization.</p>
      `
    },
    {
      id: 'lessons-from-gaming-industry',
      title: 'Lessons from Gaming Industry',
      date: '2024-01-05',
      excerpt: 'Insights from working in traditional games and GameFi projects.',
      category: 'Gaming',
      content: `
        <h2>Gaming Industry Evolution</h2>
        <p>The gaming industry has undergone remarkable transformation over the past decade. From traditional console and PC games to mobile gaming and now Web3/GameFi, the landscape continues to evolve rapidly.</p>
        
        <h2>Traditional Gaming Insights</h2>
        <p>Working in traditional game development taught me valuable lessons about:</p>
        <ul>
          <li><strong>User Experience:</strong> Games excel at creating engaging, intuitive user experiences that keep players coming back.</li>
          <li><strong>Performance Optimization:</strong> Real-time rendering and gameplay require extreme attention to performance and optimization.</li>
          <li><strong>Community Building:</strong> Successful games build strong communities that extend beyond the game itself.</li>
          <li><strong>Iterative Development:</strong> Games are refined through continuous playtesting and iteration.</li>
        </ul>
        
        <h2>GameFi and Web3</h2>
        <p>The emergence of GameFi has introduced new dimensions to game development:</p>
        <ul>
          <li>Tokenomics and economic models</li>
          <li>Decentralized ownership of in-game assets</li>
          <li>Community governance through DAOs</li>
          <li>Cross-chain interoperability</li>
        </ul>
        
        <h2>Key Takeaways</h2>
        <p>Whether working in traditional games or GameFi, the core principles remain the same: focus on creating engaging experiences, build strong communities, and continuously iterate based on user feedback. The technology may change, but the fundamentals of great game design endure.</p>
      `
    }
  ];
}

// Generate the mock notes data
const notesData = generateMockNotes()

// Generate static params for static site generation
export async function generateStaticParams() {
  return notesData.map((note) => ({
    id: note.id,
  }))
}

export default function NotePage({ params }: { params: { id: string } }) {
  const id = params.id
  
  // Find note by id (slug)
  const note = notesData.find(note => note.id === id)
  
  return <NoteContent note={note || null} />
}
