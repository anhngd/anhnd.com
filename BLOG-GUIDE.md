# 📝 Hướng Dẫn Viết Blog với Markdown

## 🎯 Tổng Quan

Website hiện đã hỗ trợ viết blog bằng Markdown với tự động generate static pages. Bạn chỉ cần viết file `.md` và hệ thống sẽ tự động xử lý phần còn lại.

## 📁 Cấu Trúc Thư Mục

```
content/notes/           # Folder chứa tất cả các bài blog (markdown files)
├── welcome-to-my-blog.md
├── markdown-syntax-guide.md
└── README.md           # Hướng dẫn chi tiết

lib/markdown.ts          # Utility functions để đọc & parse markdown
app/notes/[id]/page.tsx  # Dynamic route render blog posts
```

## ✍️ Cách Viết Bài Mới

### Bước 1: Tạo File Markdown

Tạo file mới trong `content/notes/`:

```bash
touch content/notes/ten-bai-viet-cua-ban.md
```

### Bước 2: Thêm Frontmatter

Mỗi file markdown phải bắt đầu với frontmatter (metadata):

```markdown
---
title: "Tiêu Đề Bài Viết"
date: "2024-01-20"
excerpt: "Mô tả ngắn gọn về bài viết, xuất hiện trong danh sách blog"
category: "Technology"
tags: ["tag1", "tag2"]
author: "AnhND"
---

Nội dung bài viết bắt đầu từ đây...
```

### Bước 3: Viết Nội Dung

Sử dụng Markdown syntax để viết:

```markdown
## Heading 2

Đoạn văn bản với **in đậm** và *in nghiêng*.

### Heading 3

- Danh sách không thứ tự
- Item 2

1. Danh sách có thứ tự
2. Item 2

\`\`\`javascript
// Code block với syntax highlighting
function hello() {
  console.log("Hello World!");
}
\`\`\`

> Blockquote
```

### Bước 4: Build & Deploy

```bash
# Test locally
npm run dev

# Build for production
npm run build

# Files sẽ được tự động generate trong /out
```

## 🎨 Các Tính Năng Hỗ Trợ

### ✅ Đầy Đủ

- Markdown to HTML conversion
- Frontmatter parsing
- Syntax highlighting trong code blocks
- GitHub Flavored Markdown (tables, task lists, strikethrough)
- Automatic page generation
- SEO-friendly URLs
- Responsive design

### 📝 Markdown Syntax Hỗ Trợ

- **Headers**: `# H1` đến `###### H6`
- **Text**: **bold**, *italic*, ***both***, ~~strikethrough~~
- **Lists**: Ordered & unordered với nesting
- **Links**: `[text](url)`
- **Images**: `![alt](url)`
- **Code**: Inline \`code\` và code blocks với language
- **Blockquotes**: `> quote`
- **Tables**: Full Markdown tables
- **Task lists**: `- [ ]` và `- [x]`
- **Horizontal rules**: `---` hoặc `***`

## 🔧 Công Nghệ Sử Dụng

- **gray-matter**: Parse YAML frontmatter
- **remark**: Process Markdown
- **remark-html**: Convert Markdown to HTML
- **remark-gfm**: GitHub Flavored Markdown support

## 📋 Quy Tắc Đặt Tên

### File Name
- ✅ Dùng kebab-case: `my-blog-post.md`
- ✅ Chỉ dùng chữ thường, số, và dấu gạch ngang
- ❌ KHÔNG dùng: Spaces, tiếng Việt có dấu, ký tự đặc biệt

Ví dụ:
- ✅ `building-scalable-systems.md`
- ✅ `ai-in-2024.md`
- ❌ `Building Scalable Systems.md`
- ❌ `Hệ thống AI.md`

### Frontmatter
- **title**: Có thể có tiếng Việt, ký tự đặc biệt
- **date**: Phải dùng format `YYYY-MM-DD`
- **excerpt**: Độ dài khuyến nghị 1-2 câu
- **category**: Nhất quán để dễ phân loại

## 📊 Cách Hoạt Động

1. **Build Time**: Next.js đọc tất cả file `.md` trong `content/notes/`
2. **Parse**: gray-matter tách frontmatter và content
3. **Convert**: remark chuyển Markdown → HTML
4. **Generate**: Tạo static pages cho mỗi bài viết
5. **URL**: `/notes/[filename]` (bỏ extension `.md`)

## 🚀 Ví Dụ Đầy Đủ

```markdown
---
title: "Building Scalable Data Pipelines"
date: "2024-11-20"
excerpt: "Learn how to build data pipelines that handle millions of events per day with fault tolerance and high availability."
category: "Big Data"
tags: ["data-engineering", "kafka", "spark", "architecture"]
author: "AnhND"
---

# Building Scalable Data Pipelines

In this post, I'll share lessons learned from building production data pipelines.

## The Challenge

When processing millions of events daily, every decision matters...

## Key Principles

1. **Fault Tolerance**: Design for failure
2. **Idempotency**: Operations should be repeatable
3. **Monitoring**: Instrument everything

### Code Example

\`\`\`python
def process_event(event):
    # Idempotent processing
    event_id = event['id']
    if already_processed(event_id):
        return
    
    # Process and commit
    result = transform(event)
    save_result(result)
    mark_processed(event_id)
\`\`\`

## Conclusion

Building scalable systems requires...

---

*Questions? [Email me](mailto:hi@anhnd.com)*
```

## 💡 Tips & Best Practices

1. **Preview trước khi build**: Dùng `npm run dev` để xem bài viết
2. **Viết excerpt hay**: Đây là điều người đọc thấy đầu tiên
3. **Dùng heading đúng cách**: Tạo cấu trúc rõ ràng
4. **Code examples**: Luôn chỉ rõ language cho syntax highlighting
5. **Link internal**: Dùng relative paths `/notes/other-post`
6. **Images**: Đặt trong `/public/images/` và reference bằng `/images/name.jpg`

## 🐛 Troubleshooting

### Build Error: "Cannot find module"
- Check file name không có ký tự đặc biệt
- Đảm bảo file trong `content/notes/` directory

### Post không xuất hiện
- Check frontmatter format đúng (YAML syntax)
- Đảm bảo có đủ required fields (title, date, excerpt, category)
- Run `npm run build` để rebuild

### Markdown không render đúng
- Check closing tags (code blocks phải có closing \`\`\`)
- Blockquotes phải có space sau `>`
- Lists phải có blank line phía trước

## 📚 Tài Liệu Tham Khảo

- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)
- [YAML Syntax](https://yaml.org/spec/1.2.2/)
- [Remark Documentation](https://remark.js.org/)

---

Happy blogging! 🚀 Nếu có thắc mắc, check `content/notes/README.md` hoặc xem các sample posts.

