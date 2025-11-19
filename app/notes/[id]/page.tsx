import NoteContent from './NoteContent'
import { getAllNoteIds, getNoteData } from '@/lib/markdown'

// Define note type
type Note = {
  id: string
  title: string
  date: string
  excerpt: string
  category: string
  content: string
}

// Generate static params for static site generation
export async function generateStaticParams() {
  const noteIds = getAllNoteIds()
  return noteIds.map((note) => ({
    id: note.id,
  }))
}

export default async function NotePage({ params }: { params: { id: string } }) {
  const id = params.id
  
  // Get note data from markdown file
  const noteData = await getNoteData(id)
  
  if (!noteData) {
    return <NoteContent note={null} />
  }

  const note: Note = {
    id: noteData.id,
    title: noteData.title,
    date: noteData.date,
    excerpt: noteData.excerpt,
    category: noteData.category,
    content: noteData.contentHtml
  }
  
  return <NoteContent note={note} />
}

// Old mock data (keeping for reference, will be removed later)
function generateMockNotesOld(): Note[] {
  return [
    {
      id: 'building-data-pipelines-at-scale',
      title: 'Building Data Pipelines at Scale',
      date: '2024-11-15',
      excerpt: 'Lessons learned from processing millions of events per day. How we designed fault-tolerant pipelines that handle peak traffic without breaking.',
      category: 'Big Data',
      content: `
        <h2>Introduction</h2>
        <p>Building data pipelines that can handle millions of events per day is no small feat. It requires careful architectural decisions, robust error handling, and continuous monitoring to ensure data flows smoothly even during peak traffic.</p>
        
        <h2>The Challenge</h2>
        <p>When you're processing millions of events daily, every decision matters. A small inefficiency multiplied by millions becomes a major bottleneck. We learned this the hard way.</p>
        
        <h2>Key Principles</h2>
        <ul>
          <li><strong>Fault Tolerance:</strong> Design for failure. Systems will fail, but your pipeline shouldn't lose data.</li>
          <li><strong>Idempotency:</strong> Make operations repeatable without side effects.</li>
          <li><strong>Backpressure Handling:</strong> Know when to slow down and buffer intelligently.</li>
          <li><strong>Monitoring:</strong> You can't fix what you can't see. Instrument everything.</li>
        </ul>
        
        <h2>Real-World Solutions</h2>
        <p>We implemented a multi-stage pipeline with Apache Kafka for streaming, Spark for processing, and a combination of hot and cold storage. The key was maintaining exactly-once semantics while achieving the throughput we needed.</p>
        
        <p>The most important lesson? Start simple. Optimize when you have real data showing where the bottlenecks are. Premature optimization in data pipelines is expensive and often wrong.</p>
      `
    },
    {
      id: 'ai-in-production-beyond-the-hype',
      title: 'AI in Production: Beyond the Hype',
      date: '2024-11-08',
      excerpt: 'Real-world challenges of deploying machine learning models. From training to monitoring, what actually matters in production systems.',
      category: 'AI/ML',
      content: `
        <h2>The Reality Check</h2>
        <p>Everyone talks about AI transforming businesses. Few talk about the messy reality of getting ML models into production and keeping them there. This is that story.</p>
        
        <h2>Beyond Jupyter Notebooks</h2>
        <p>Your model performed great in development. Congratulations. Now comes the hard part: making it work reliably in production where real users depend on it.</p>
        <ul>
          <li>Model drift is real and happens faster than you think</li>
          <li>Data quality issues you never saw in training will appear in production</li>
          <li>Latency requirements will force architectural compromises</li>
          <li>Monitoring ML systems is different from monitoring traditional software</li>
        </ul>
        
        <h2>What Actually Matters</h2>
        <p>After deploying dozens of models, here's what we learned matters most:</p>
        <ul>
          <li><strong>Data Quality:</strong> Garbage in, garbage out. Always.</li>
          <li><strong>Feature Engineering:</strong> Still more important than the algorithm choice.</li>
          <li><strong>Model Monitoring:</strong> Track predictions, not just system metrics.</li>
          <li><strong>Rollback Strategy:</strong> Have a plan when things go wrong.</li>
        </ul>
        
        <h2>Practical Advice</h2>
        <p>Start with simple baselines. A well-implemented logistic regression often beats a poorly implemented neural network. Focus on the engineering infrastructure first—serving, monitoring, retraining. The fancy algorithms can wait.</p>
      `
    },
    {
      id: 'the-hidden-cost-of-technical-debt',
      title: 'The Hidden Cost of Technical Debt',
      date: '2024-10-28',
      excerpt: 'Why that quick fix from 2 years ago is now costing you millions. A framework for measuring and managing technical debt in growing teams.',
      category: 'Engineering',
      content: `
        <h2>The Quick Fix That Wasn't</h2>
        <p>Two years ago, someone took a shortcut. It was just a small hack to ship a critical feature on time. Today, that "temporary" solution is costing the company millions in developer productivity and lost opportunities.</p>
        
        <h2>Technical Debt Compounds</h2>
        <p>Like financial debt, technical debt compounds. But unlike financial debt, it's invisible on balance sheets until it's too late. The interest comes in the form of:</p>
        <ul>
          <li>Slower feature development</li>
          <li>More bugs and production incidents</li>
          <li>Difficulty onboarding new engineers</li>
          <li>Inability to adopt new technologies</li>
        </ul>
        
        <h2>Measuring Technical Debt</h2>
        <p>You can't manage what you don't measure. We developed a framework to quantify technical debt:</p>
        <ul>
          <li><strong>Time Tax:</strong> How much longer tasks take due to existing issues</li>
          <li><strong>Fragility Score:</strong> Frequency and severity of incidents</li>
          <li><strong>Knowledge Silos:</strong> Bus factor for critical systems</li>
          <li><strong>Technology Lag:</strong> Distance from industry best practices</li>
        </ul>
        
        <h2>Paying Down Debt</h2>
        <p>The key is balance. You can't stop everything to refactor. But you also can't ignore it. We allocate 20% of each sprint to addressing technical debt—enough to prevent compound interest without derailing product velocity.</p>
      `
    },
    {
      id: 'from-developer-to-engineering-manager',
      title: 'From Developer to Engineering Manager',
      date: '2024-10-20',
      excerpt: 'The transition nobody tells you about. What I wish I knew before taking my first management role and the mistakes I made along the way.',
      category: 'Management',
      content: `
        <h2>The Day Everything Changed</h2>
        <p>One day you're writing code. The next, you're responsible for people who write code. The skills that made you a great developer don't automatically translate to management. I learned this the hard way.</p>
        
        <h2>What They Don't Tell You</h2>
        <ul>
          <li>You'll miss coding more than you expect</li>
          <li>Most of your time will be spent in meetings (and that's okay)</li>
          <li>Your success is now measured by your team's success, not your code</li>
          <li>People problems are harder than technical problems</li>
        </ul>
        
        <h2>Common Mistakes</h2>
        <p>I made plenty of mistakes in my first year as a manager. Here are the big ones:</p>
        <ul>
          <li><strong>Trying to code too much:</strong> You can't be both the best engineer and the best manager</li>
          <li><strong>Not delegating enough:</strong> Trust your team. That's why you hired them</li>
          <li><strong>Avoiding difficult conversations:</strong> They don't get easier with time</li>
          <li><strong>Forgetting to celebrate wins:</strong> Your team needs to know they're doing well</li>
        </ul>
        
        <h2>What Actually Works</h2>
        <p>After years of management, here's what matters: Clear communication. Regular 1-on-1s. Creating psychological safety. Removing blockers. And remembering that your job is to make your team successful, not to be the hero.</p>
      `
    },
    {
      id: 'web3-gaming-promises-vs-reality',
      title: 'Web3 Gaming: Promises vs Reality',
      date: '2024-10-12',
      excerpt: 'After 3 years building blockchain games, here\'s what actually works and what\'s still just hype. Lessons from millions of on-chain transactions.',
      category: 'Web3',
      content: `
        <h2>The Promise</h2>
        <p>Web3 was supposed to revolutionize gaming: true ownership, play-to-earn, decentralized economies. After three years and millions of on-chain transactions, here's what we actually learned.</p>
        
        <h2>What Actually Works</h2>
        <ul>
          <li><strong>True Ownership:</strong> Players genuinely value owning their assets, even if they rarely trade them</li>
          <li><strong>Transparent Economics:</strong> Blockchain provides unprecedented transparency in game economies</li>
          <li><strong>Composability:</strong> Assets working across games is powerful when done right</li>
        </ul>
        
        <h2>What's Still Hype</h2>
        <p>Not everything in Web3 gaming lives up to the promise:</p>
        <ul>
          <li>Play-to-earn is fundamentally unsustainable without real value creation</li>
          <li>Gas fees remain a UX nightmare for mainstream players</li>
          <li>Most players don't care about decentralization—they care about fun</li>
          <li>Token prices don't make a bad game good</li>
        </ul>
        
        <h2>The Real Lesson</h2>
        <p>Web3 is a tool, not a solution. The best blockchain games succeed because they're good games first. The blockchain enhances the experience; it doesn't create it. Focus on gameplay. Use Web3 where it genuinely adds value. Don't force it where it doesn't.</p>
      `
    },
    {
      id: 'digital-transformation-in-government',
      title: 'Digital Transformation in Government',
      date: '2024-09-30',
      excerpt: 'Why government tech projects fail (and how to fix them). 7 years of lessons from modernizing legacy systems in public sector.',
      category: 'Gov Tech',
      content: `
        <h2>The Challenge</h2>
        <p>Government technology projects have a reputation for failure. After seven years working on digital transformation in the public sector, I understand why—and more importantly, how to fix it.</p>
        
        <h2>Why They Fail</h2>
        <ul>
          <li><strong>Procurement processes:</strong> By the time the contract is signed, the requirements are outdated</li>
          <li><strong>Risk aversion:</strong> Fear of failure leads to waterfall approaches that guarantee it</li>
          <li><strong>Stakeholder complexity:</strong> Too many cooks, not enough clear ownership</li>
          <li><strong>Legacy integration:</strong> 40-year-old COBOL systems that nobody dares to touch</li>
        </ul>
        
        <h2>What Actually Works</h2>
        <p>Success in government tech requires a different approach:</p>
        <ul>
          <li>Start small, show value, then scale</li>
          <li>Focus on user needs, not procurement requirements</li>
          <li>Build trust through transparency and iteration</li>
          <li>Invest in change management—technology is easy, people are hard</li>
        </ul>
        
        <h2>The Real Problem</h2>
        <p>The hardest problems in government tech aren't technical—they're organizational. You're not just building software; you're changing how government works. That requires patience, empathy, and understanding that success is measured in years, not sprints.</p>
      `
    },
    {
      id: 'the-economics-of-virtual-goods',
      title: 'The Economics of Virtual Goods',
      date: '2024-09-22',
      excerpt: 'How in-game economies mirror real markets. Designing sustainable virtual economies that players actually enjoy and don\'t exploit.',
      category: 'Gaming',
      content: `
        <h2>Virtual Economics Are Real Economics</h2>
        <p>In-game economies behave remarkably like real-world markets. They have inflation, deflation, speculation, and crashes. Players find arbitrage opportunities. Markets emerge. And if you design the economy poorly, players will exploit it until the game collapses.</p>
        
        <h2>Common Economic Pitfalls</h2>
        <ul>
          <li><strong>Infinite supply:</strong> No scarcity means no value. Basic economics.</li>
          <li><strong>No sinks:</strong> Currency that only flows in eventually hyperinflates</li>
          <li><strong>Broken loops:</strong> Positive feedback loops that reward the rich and punish the poor</li>
          <li><strong>Ignoring player psychology:</strong> Perceived value matters more than mathematical value</li>
        </ul>
        
        <h2>Designing Sustainable Economies</h2>
        <p>A good game economy needs balance:</p>
        <ul>
          <li>Multiple currencies with different purposes</li>
          <li>Faucets (sources) balanced with sinks (uses)</li>
          <li>Progression that feels rewarding but isn't exploitable</li>
          <li>Regular monitoring and rebalancing based on actual player behavior</li>
        </ul>
        
        <h2>The Human Element</h2>
        <p>Remember: players are humans, not rational economic actors. They make emotional decisions. They speculate. They hoard. Your economy needs to work for real human behavior, not theoretical perfect players.</p>
      `
    },
    {
      id: 'building-teams-that-ship',
      title: 'Building Teams That Ship',
      date: '2024-09-15',
      excerpt: 'Culture eats strategy for breakfast. How to build engineering teams that consistently deliver without burning out.',
      category: 'Management',
      content: `
        <h2>The Shipping Problem</h2>
        <p>Some teams consistently ship great products. Others get stuck in endless planning, refactoring, and discussions. The difference isn't talent or tools—it's culture.</p>
        
        <h2>What High-Performing Teams Do Differently</h2>
        <ul>
          <li><strong>Bias for action:</strong> They prefer making decisions over debating them</li>
          <li><strong>Ownership mindset:</strong> Team members act like they own the product</li>
          <li><strong>Psychological safety:</strong> People feel safe to try, fail, and learn</li>
          <li><strong>Clear priorities:</strong> Everyone knows what matters most</li>
        </ul>
        
        <h2>Common Blockers</h2>
        <p>What prevents teams from shipping?</p>
        <ul>
          <li>Perfectionism masquerading as quality</li>
          <li>Lack of decision-making authority</li>
          <li>Unclear success criteria</li>
          <li>Technical debt that makes every change painful</li>
          <li>Meeting overload that fragments focus time</li>
        </ul>
        
        <h2>Building Shipping Culture</h2>
        <p>Culture change starts with small, consistent actions. Celebrate shipping. Make it easy to deploy. Give teams autonomy. Remove organizational friction. And most importantly, lead by example—if you say shipping matters, prove it through your actions.</p>
      `
    },
    {
      id: 'when-to-not-use-microservices',
      title: 'When to NOT Use Microservices',
      date: '2024-09-08',
      excerpt: 'The monolith isn\'t dead. Why we moved back from microservices and what we learned about architectural decisions.',
      category: 'Architecture',
      content: `
        <h2>The Microservices Migration</h2>
        <p>We broke our monolith into 47 microservices. It was supposed to improve scalability, deployment independence, and team autonomy. Instead, we got a distributed mess that was harder to develop, debug, and deploy than the monolith ever was.</p>
        
        <h2>When Microservices Make Sense</h2>
        <p>Don't misunderstand—microservices aren't bad. They're appropriate when:</p>
        <ul>
          <li>You have clear bounded contexts with minimal coupling</li>
          <li>You have multiple teams that need independent deployment cycles</li>
          <li>Different parts of your system have vastly different scaling requirements</li>
          <li>You have the operational maturity to handle distributed systems</li>
        </ul>
        
        <h2>The Hidden Costs</h2>
        <ul>
          <li><strong>Operational complexity:</strong> Now you need to monitor, deploy, and debug N services</li>
          <li><strong>Network overhead:</strong> Every function call became a network call</li>
          <li><strong>Data consistency:</strong> Distributed transactions are hard</li>
          <li><strong>Development velocity:</strong> Making changes across services is painful</li>
        </ul>
        
        <h2>Our Solution</h2>
        <p>We moved back to a well-designed monolith with clear module boundaries. We kept the lessons learned about decoupling and bounded contexts. But we eliminated the operational overhead of distributed systems. Sometimes the old ways are better.</p>
      `
    },
    {
      id: 'data-privacy-in-the-age-of-ai',
      title: 'Data Privacy in the Age of AI',
      date: '2024-09-01',
      excerpt: 'Balancing innovation with privacy. Practical approaches to building AI systems that respect user data and comply with regulations.',
      category: 'Data',
      content: `
        <h2>The Innovation-Privacy Tension</h2>
        <p>AI thrives on data. Privacy restricts data. How do you build powerful AI systems while respecting user privacy and complying with GDPR, CCPA, and other regulations? This isn't a theoretical question—it's a daily challenge.</p>
        
        <h2>Common Privacy Pitfalls</h2>
        <ul>
          <li><strong>Data hoarding:</strong> Collecting everything "just in case" we need it later</li>
          <li><strong>Weak consent:</strong> Burying data usage in unreadable terms of service</li>
          <li><strong>Purpose creep:</strong> Using data for purposes beyond what users agreed to</li>
          <li><strong>Inadequate security:</strong> Storing sensitive data without proper protection</li>
        </ul>
        
        <h2>Privacy-Preserving AI</h2>
        <p>You can build effective AI systems while respecting privacy:</p>
        <ul>
          <li><strong>Differential privacy:</strong> Add noise to protect individual data points</li>
          <li><strong>Federated learning:</strong> Train models without centralizing data</li>
          <li><strong>Data minimization:</strong> Only collect what you actually need</li>
          <li><strong>Clear consent:</strong> Be transparent about data usage</li>
        </ul>
        
        <h2>The Business Case</h2>
        <p>Privacy isn't just about compliance—it's good business. Users trust companies that respect their data. Breaches are expensive. And privacy-by-design often leads to better, more focused AI systems. The constraints make you creative.</p>
      `
    }
  ];
}
