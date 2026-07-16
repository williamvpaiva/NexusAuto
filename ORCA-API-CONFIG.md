# NexusAuto API Provider Configuration

Complete guide for configuring multiple AI API providers in NexusAuto/Orca: OpenRouter, NVIDIA, DeepSeek, Claude, GPT-4, Gemini, and more.

---

## Table of Contents

1. [Supported Providers](#1-supported-providers)
2. [Provider Configuration](#2-provider-configuration)
3. [Environment Setup](#3-environment-setup)
4. [Provider-Specific Setup](#4-provider-specific-setup)
5. [Model Selection](#5-model-selection)
6. [Usage Examples](#6-usage-examples)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Supported Providers

| Provider | Environment Variable | API Type | Models |
|----------|---------------------|----------|--------|
| **OpenRouter** | `OPENROUTER_API_KEY` | REST | Claude, GPT, Gemini, Llama, Mistral, DeepSeek, Qwen, etc. |
| **NVIDIA** | `NVIDIA_API_KEY` | REST | NVIDIA NIM models |
| **DeepSeek** | `DEEPSEEK_API_KEY` | REST | DeepSeek Coder, DeepSeek Chat |
| **Claude (Anthropic)** | `ANTHROPIC_API_KEY` | REST | Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku |
| **OpenAI** | `OPENAI_API_KEY` | REST | GPT-4o, GPT-4 Turbo, GPT-3.5 Turbo |
| **Google Gemini** | `GEMINI_API_KEY` | REST | Gemini 1.5 Pro, Gemini 1.5 Flash, Gemini Pro |
| **Moonshot (Kimi)** | `MOONSHOT_API_KEY` | REST | Moonshot V1 |
| **Qwen (Alibaba)** | `DASHSCOPE_API_KEY` | REST | Qwen 2, Qwen-Max |
| **MiniMax** | `MINIMAX_API_KEY` | REST | MiniMax models |
| **Zhipu AI** | `ZHIPU_AI_API_KEY` | REST | GLM-4, GLM-4V |
| **ARK (ByteDance)** | `ARK_API_KEY` | REST | ARK models |

---

## 2. Provider Configuration

### Quick Start

Create a `.env` file in the project root with your API keys:

```bash
# .env file
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NVIDIA_API_KEY=nv-api-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Orca Settings (`~/.orca/settings.json`)

```json
{
  "providers": {
    "openrouter": "${OPENROUTER_API_KEY}",
    "nvidia": "${NVIDIA_API_KEY}",
    "deepseek": "${DEEPSEEK_API_KEY}",
    "claude": "${ANTHROPIC_API_KEY}",
    "openai": "${OPENAI_API_KEY}",
    "gemini": "${GEMINI_API_KEY}",
    "moonshot": "${MOONSHOT_API_KEY}",
    "qwen": "${DASHSCOPE_API_KEY}",
    "minimax": "${MINIMAX_API_KEY}",
    "zhipu": "${ZHIPU_AI_API_KEY}",
    "ark": "${ARK_API_KEY}"
  },
  "defaultProvider": "openrouter",
  "models": {
    "openrouter": {
      "preferred": "anthropic/claude-3.5-sonnet",
      "fallback": "deepseek/deepseek-chat"
    },
    "nvidia": {
      "preferred": "nvidia/llama-3.1-nemotron-70b-instruct"
    },
    "deepseek": {
      "preferred": "deepseek-chat"
    },
    "claude": {
      "preferred": "claude-3-5-sonnet-20241022"
    },
    "openai": {
      "preferred": "gpt-4o"
    },
    "gemini": {
      "preferred": "gemini-1.5-pro"
    }
  }
}
```

---

## 3. Environment Setup

### Global Environment Variables

Add to your shell profile (`~/.bashrc`, `~/.zshrc`, or Windows Environment Variables):

```bash
# Core APIs
export OPENROUTER_API_KEY="sk-or-v1-..."
export NVIDIA_API_KEY="nv-api-..."
export DEEPSEEK_API_KEY="sk-..."

# Additional Providers
export ANTHROPIC_API_KEY="sk-ant-..."
export OPENAI_API_KEY="sk-..."
export GEMINI_API_KEY="..."

# Optional Providers
export MOONSHOT_API_KEY="..."
export DASHSCOPE_API_KEY="..."
export MINIMAX_API_KEY="..."
export ZHIPU_AI_API_KEY="..."
export ARK_API_KEY="..."

# Project Root
export NEXUS_PROJECT_ROOT="D:/NexusAuto"
```

### Windows PowerShell

```powershell
# Set permanently
[Environment]::SetEnvironmentVariable("OPENROUTER_API_KEY", "sk-or-v1-...", "User")
[Environment]::SetEnvironmentVariable("NVIDIA_API_KEY", "nv-api-...", "User")

# Set for session
$env:OPENROUTER_API_KEY = "sk-or-v1-..."
```

### Verification

```bash
# Verify keys are set
echo $OPENROUTER_API_KEY | cut -c1-10
echo $NVIDIA_API_KEY | cut -c1-10
```

---

## 4. Provider-Specific Setup

### 4.1 OpenRouter (Recommended)

**Why:** Single API key for 100+ models including Claude, GPT, Gemini, Llama, Mistral, DeepSeek, Qwen, etc.

**Setup:**
1. Get key: https://openrouter.ai/keys
2. Add credit (minimum $10)
3. Set environment variable

**Popular Models:**
```
anthropic/claude-3.5-sonnet          # Best overall
anthropic/claude-3-opus              # Most capable
openai/gpt-4o                        # GPT-4o
openai/gpt-4-turbo                   # Fast GPT-4
google/gemini-1.5-pro                # Google's best
deepseek/deepseek-chat               # Best value
meta-llama/llama-3.1-405b-instruct   # Open source best
mistralai/mistral-large-2            # Europe's best
qwen/qwen-2.5-72b-instruct            # Alibaba's best
```

**Pricing:** Pay-per-token, varies by model. Check https://openrouter.ai/models

---

### 4.2 NVIDIA

**Why:** NVIDIA NIM models with high throughput, competitive pricing

**Setup:**
1. Get key: https://ngc.nvidia.com/setup/api-key
2. Set environment variable

**Popular Models:**
```
nvidia/llama-3.1-nemotron-70b-instruct
nvidia/nemotron-4-mini-hindustani-4b
nvidia/llama-3.1-nemotron-8b-instruct
```

---

### 4.3 DeepSeek

**Why:** Best value for code tasks, competitive pricing

**Setup:**
1. Get key: https://platform.deepseek.com/api_key
2. Set environment variable

**Popular Models:**
```
deepseek-chat        # General chat
deepseek-coder       # Code-specific
deepseek-chat-27b    # Larger model
```

---

### 4.4 Claude (Anthropic Direct)

**Why:** Direct API access without OpenRouter markup, potentially lower costs for high volume

**Setup:**
1. Get key: https://console.anthropic.com/settings/keys
2. Set environment variable

**Models:**
```
claude-3-5-sonnet-20241022    # Recommended
claude-3-opus-20240229         # Most capable
claude-3-haiku-20240307         # Fastest, cheapest
```

---

### 4.5 OpenAI Direct

**Why:** Direct API access for GPT models

**Setup:**
1. Get key: https://platform.openai.com/api-keys
2. Set environment variable

**Models:**
```
gpt-4o                      # Latest, recommended
gpt-4o-mini                 # Fast, cheap
gpt-4-turbo                 # Fast GPT-4
gpt-3.5-turbo               # Cheapest
```

---

### 4.6 Google Gemini

**Why:** Large context windows, competitive pricing for high volume

**Setup:**
1. Get key: https://aistudio.google.com/app/apikey
2. Set environment variable

**Models:**
```
gemini-1.5-pro              # Large context, best quality
gemini-1.5-flash            # Fast, cheap
gemini-1.5-flash-8b         # Very fast, very cheap
gemini-pro                  # Previous generation
```

---

## 5. Model Selection

### By Task Type

| Task | Recommended Provider | Model |
|------|---------------------|-------|
| **General development** | OpenRouter | `anthropic/claude-3.5-sonnet` |
| **Code generation** | DeepSeek | `deepseek-coder` |
| **Code review** | OpenRouter | `anthropic/claude-3.5-sonnet` |
| **Large context analysis** | Gemini | `gemini-1.5-pro` |
| **Fast tasks** | OpenAI | `gpt-4o-mini` |
| **Cost optimization** | DeepSeek | `deepseek-chat` |
| **Open source models** | OpenRouter | `meta-llama/llama-3.1-405b` |
| **Multi-language** | Qwen | `qwen/qwen-2.5-72b` |

### By Priority

```markdown
## Tier 1: Primary (High Quality)
- anthropic/claude-3.5-sonnet
- gpt-4o
- gemini-1.5-pro

## Tier 2: Balanced (Quality + Speed)
- deepseek-chat
- gpt-4o-mini
- gemini-1.5-flash

## Tier 3: Cost-Optimized
- deepseek-coder (code tasks)
- llama-3.1-70b-instruct
- qwen-2.5-72b-instruct

## Tier 4: Fast/Prototype
- gpt-4o-mini
- gemini-1.5-flash-8b
```

---

## 6. Usage Examples

### In Orca

```bash
# Switch provider
/provider openrouter
/provider nvidia
/provider deepseek

# Check current
/provider current

# List available models
/models list --provider openrouter
```

### In NexusAuto Scripts

```javascript
// scripts/ai-request.js
const providers = {
  openrouter: {
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY
  },
  deepseek: {
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY
  }
};

// Use provider
const response = await fetch(`${providers.openrouter.baseURL}/chat/completions`, {
  headers: {
    'Authorization': `Bearer ${providers.openrouter.apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'anthropic/claude-3.5-sonnet',
    messages: [{ role: 'user', content: 'Hello' }]
  })
});
```

### In CowAgent

```python
# cowagent/agent/providers.py
class AIProvider:
    def __init__(self, provider='openrouter', model=None):
        self.provider = provider
        self.model = model or self.default_models[provider]
        
    default_models = {
        'openrouter': 'anthropic/claude-3.5-sonnet',
        'nvidia': 'nvidia/llama-3.1-nemotron-70b-instruct',
        'deepseek': 'deepseek-chat',
        'claude': 'claude-3-5-sonnet-20241022',
        'openai': 'gpt-4o',
        'gemini': 'gemini-1.5-pro'
    }
```

---

## 7. Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| API key invalid | Wrong format | Check key format, no extra spaces |
| Rate limit | Too many requests | Add delay, use fallback model |
| Quota exceeded | Spend limit reached | Add credit or reduce usage |
| Model not found | Wrong model ID | Check OpenRouter model list |
| Timeout | Slow model/connection | Try faster model, check connection |
| Permission denied | Wrong API key | Regenerate key |

### Verify API Keys

```bash
# Test OpenRouter
curl https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer $OPENROUTER_API_KEY"

# Test DeepSeek
curl https://api.deepseek.com/v1/models \
  -H "Authorization: Bearer $DEEPSEEK_API_KEY"

# Test Claude
curl https://api.anthropic.com/v1/models \
  -H "x-api-key: $ANTHROPIC_API_KEY"
```

### Cost Management

```bash
# Set spending limits
# OpenRouter: https://openrouter.ai/settings/limits

# Monitor usage
# OpenRouter: https://openrouter.ai/usage
```

### Provider Status Pages

| Provider | Status Page |
|----------|-------------|
| OpenRouter | https://openrouter.statuspage.io |
| NVIDIA | https://status.nvidia.com |
| DeepSeek | https://platform.deepseek.com/docs |
| Anthropic | https://status.anthropic.com |
| OpenAI | https://status.openai.com |
| Google | https://status.cloud.google.com |

---

## Quick Reference

```bash
# Environment Setup Summary
export OPENROUTER_API_KEY="sk-or-v1-..."
export NVIDIA_API_KEY="nv-api-..."
export DEEPSEEK_API_KEY="sk-..."
export ANTHROPIC_API_KEY="sk-ant-..."
export OPENAI_API_KEY="sk-..."
export GEMINI_API_KEY="..."

# In Orca, use:
/provider openrouter  # or any configured provider
/model anthropic/claude-3.5-sonnet
```