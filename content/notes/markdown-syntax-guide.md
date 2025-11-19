---
title: "Markdown Syntax Guide"
date: "2024-01-20"
excerpt: "A comprehensive guide to writing blog posts in Markdown format with examples of all supported syntax."
category: "Tutorial"
tags: ["markdown", "writing", "tutorial"]
author: "AnhND"
---

# Markdown Syntax Guide

This guide demonstrates all the Markdown syntax supported in blog posts.

## Headings

Use `#` for headings. More `#` means smaller heading.

```markdown
# H1 Heading
## H2 Heading
### H3 Heading
```

## Text Formatting

You can make text **bold**, *italic*, or ***both***.

- **Bold**: `**text**` or `__text__`
- *Italic*: `*text*` or `_text_`
- ***Bold and Italic***: `***text***`
- ~~Strikethrough~~: `~~text~~`

## Lists

### Unordered Lists

- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
- Item 3

### Ordered Lists

1. First item
2. Second item
3. Third item
   1. Nested item 3.1
   2. Nested item 3.2

## Links and Images

Create links: [AnhND Website](https://anhnd.com)

Syntax: `[Link Text](URL)`

## Code

### Inline Code

Use `backticks` for inline code.

### Code Blocks

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet('World');
```

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
```

## Blockquotes

> "The best way to predict the future is to invent it."
> 
> — Alan Kay

Use `>` for blockquotes.

## Tables

| Feature | Supported | Notes |
|---------|-----------|-------|
| Headers | ✅ | H1-H6 |
| Lists | ✅ | Ordered & Unordered |
| Code | ✅ | Inline & Blocks |
| Tables | ✅ | With alignment |

## Horizontal Rules

Create horizontal rules with `---` or `***`:

---

## Task Lists

- [x] Write blog post
- [x] Add code examples
- [ ] Publish article
- [ ] Share on social media

## Frontmatter

Every blog post should start with YAML frontmatter:

```yaml
---
title: "Your Post Title"
date: "2024-01-20"
excerpt: "Brief description of your post"
category: "Technology"
tags: ["tag1", "tag2"]
author: "Your Name"
---
```

## Tips for Writing

1. **Keep it simple**: Clear and concise writing is better
2. **Use examples**: Show, don't just tell
3. **Structure matters**: Use headings to organize content
4. **Proofread**: Always review before publishing

---

Happy writing! 📝

