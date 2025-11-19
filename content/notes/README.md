# How to Write Blog Posts

This blog uses Markdown files for content. Here's how to add new posts.

## Creating a New Post

1. Create a new `.md` file in this directory (`content/notes/`)
2. Name it using kebab-case (e.g., `my-awesome-post.md`)
3. Add frontmatter at the top with post metadata
4. Write your content in Markdown below the frontmatter

## Frontmatter Format

Every post must start with YAML frontmatter between `---` markers:

```markdown
---
title: "Your Post Title"
date: "2024-01-20"
excerpt: "A brief description of your post (1-2 sentences)"
category: "Technology"
tags: ["tag1", "tag2", "tag3"]
author: "AnhND"
---

Your content starts here...
```

### Frontmatter Fields

- **title** (required): The post title
- **date** (required): Publication date in YYYY-MM-DD format
- **excerpt** (required): Short description for listings
- **category** (required): Post category (e.g., "Technology", "Tutorial", "Management")
- **tags** (optional): Array of relevant tags
- **author** (optional): Author name (defaults to "AnhND")

## Markdown Syntax

You can use all standard Markdown syntax:

### Headings
```markdown
# H1
## H2
### H3
```

### Text Formatting
```markdown
**bold text**
*italic text*
***bold and italic***
~~strikethrough~~
```

### Lists
```markdown
- Unordered item
- Another item

1. Ordered item
2. Another item
```

### Links
```markdown
[Link Text](https://example.com)
```

### Code

Inline code: \`code here\`

Code blocks:
\`\`\`javascript
function hello() {
  console.log("Hello World!");
}
\`\`\`

### Blockquotes
```markdown
> This is a quote
```

### Tables
```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

## After Creating a Post

1. The post will automatically appear in the blog list
2. Run `npm run build` to generate static pages
3. The post URL will be `/notes/your-file-name`

## File Naming

- Use kebab-case: `my-post-title.md`
- No spaces or special characters
- The filename becomes the URL slug

## Example Post

See `welcome-to-my-blog.md` and `markdown-syntax-guide.md` for complete examples.

## Tips

1. **Keep filenames clean**: The filename becomes the URL
2. **Write good excerpts**: They appear in the blog list
3. **Use categories consistently**: Helps with organization
4. **Date format matters**: Always use YYYY-MM-DD
5. **Preview before publishing**: Run `npm run dev` to see your post locally

## Automatic Features

- ✅ Markdown to HTML conversion
- ✅ Syntax highlighting for code blocks
- ✅ GitHub Flavored Markdown (tables, task lists, etc.)
- ✅ Automatic page generation
- ✅ SEO-friendly URLs

Happy writing! 📝

