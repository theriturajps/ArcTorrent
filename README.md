# ArcTorrent 

ArcTorrent is a powerful torrent search aggregator that allows users to search across multiple torrent websites simultaneously.

## 🌟 Features

- Search across 8+ torrent websites
- Quick and intuitive interface
- Multiple download options (Magnet, Torrent)
- Keyboard shortcuts
- Responsive design

## 🚀 Live Demo

Visit: [https://torrent.exonoob.in/](https://torrent.exonoob.in/)

## 🔑 Keyboard Shortcuts

- `Ctrl/Cmd + F`: Focus search bar
- `Ctrl/Cmd + Enter`: Trigger search
- `Enter`: Instant search results


## 📡 Endpoint
```
/api/{website}/{query}/{page?}
```

## 🔍 Supported Websites
- `1337x`
- `nyaasi`
- `yts`
- `piratebay`
- `torlock`
- `tgx` (Torrent Galaxy)
- `limetorrent`
- `glodls`
- `all` (Search across all platforms)

## 🚦 Request Parameters

### Path Parameters
| Parameter | Type    | Required | Description | Default | Constraints |
|-----------|---------|----------|-------------|---------|-------------|
| `website` | String  | Yes | Target torrent website | - | Must be one of supported websites |
| `query`   | String  | Yes | Search term | - | Min 2 characters |
| `page`    | Integer | No  | Result page number | 1 | Min: 1, Max varies by website |

## 📥 Response Structure

### Successful Response
```json
[
  {
    "Name": "Torrent Title",
    "Size": "File Size",
    "Seeders": "Seed Count",
    "Magnet": "Magnet Link",
    "Torrent": "Torrent File URL",
    "Category": "Content Category"
  }
]
```

## 🔬 Example Requests

### 1. Search YTS for "matrix"
```bash
GET /api/yts/matrix/1
```

### 2. Search 1337x for "ubuntu" on page 2
```bash
GET /api/1337x/ubuntu/2
```

### 3. Global Search Across All Platforms
```bash
GET /api/all/linux/1
```

## 📊 Pagination & Limits

### Website-Specific Page Limits
| Website    | Max Pages | Notes |
|------------|-----------|-------|
| `1337x`    | 50        | Beyond 50, no results |
| `nyaasi`   | 14        | Last accessible page |
| Others     | Varies    | Typically 10-20 pages |

## 🛡️ Error Handling

### Common Error Responses
| Error Code | Description |
|------------|-------------|
| `404`      | Invalid website or path |
| `500`      | Internal server error |
| `Specific Error Messages` | Website blocked, no results |

## 💡 Best Practices
- Use URL encoding for complex queries
- Implement rate limiting
- Handle potential network errors
- Cache results when possible

## ⚠️ Legal Notice

Users are responsible for their actions. Always respect copyright laws and use torrents legally.


## 🔐 Rate Limiting
- Recommended: Maximum 10 requests/minute
- Implement exponential backoff for errors

## 📞 Support
- **Email**: iamriturajps@gmail.com
- **Twitter**: [@riturajps](https://twitter.com/riturajps)
- **Instagram**: [@riturajps](https://instagram.com/riturajps)
- **LinkedIn**: [Ritu Raj Pratap Singh](https://linkedin.com/in/iamriturajps)
- **Telegram**: [@riturajps](https://t.me/riturajps)
- **GitHub**: [@theriturajps](https://github.com/theriturajps)
- **Project Issues**: [Project Issues](https://github.com/theriturajps/ArcTorrent/issues)