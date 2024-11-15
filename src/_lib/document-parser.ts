import { parse as parseCSV } from 'csv-parse/sync'
import { XMLParser } from 'fast-xml-parser'
import { load as parseYAML } from 'js-yaml'
import { marked } from 'marked' // Import marked directly
import { JSDOM } from 'jsdom'

export const parseDocument = {
  async fromHtml(html: string): Promise<string> {
    try {
      const dom = new JSDOM(html)
      const text = dom.window.document.body.textContent || ''
      return JSON.stringify({ content: text.trim() })
    } catch (error) {
      console.error('HTML parsing error:', error)
      return JSON.stringify({ error: 'Failed to parse HTML', raw: html })
    }
  },

  async fromMarkdown(markdown: string): Promise<string> {
    try {
      const html = await marked.parse(markdown) // Use marked.parse instead of marked directly
      return this.fromHtml(html)
    } catch (error) {
      console.error('Markdown parsing error:', error)
      return JSON.stringify({ error: 'Failed to parse Markdown', raw: markdown })
    }
  },

  async csv(content: string): Promise<string> {
    try {
      const records = parseCSV(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        cast: true
      })
      return JSON.stringify(records)
    } catch (error) {
      console.error('CSV parsing error:', error)
      return JSON.stringify({ error: 'Failed to parse CSV', raw: content })
    }
  },

  async xml(content: string): Promise<string> {
    try {
      const options = {
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        parseAttributeValue: true
      }
      const parser = new XMLParser(options)
      const result = parser.parse(content)
      return JSON.stringify(result)
    } catch (error) {
      console.error('XML parsing error:', error)
      return JSON.stringify({ error: 'Failed to parse XML', raw: content })
    }
  },

  async yaml(content: string): Promise<string> {
    try {
      const result = parseYAML(content)
      return JSON.stringify(result)
    } catch (error) {
      console.error('YAML parsing error:', error)
      return JSON.stringify({ error: 'Failed to parse YAML', raw: content })
    }
  },

  async autoDetect(content: string): Promise<string> {
    // Try JSON first
    try {
      JSON.parse(content)
      return content
    } catch {}

    // Check for CSV
    if (content.includes(',') && /[\r\n]/.test(content)) {
      try {
        return await this.csv(content)
      } catch {}
    }

    // Check for XML
    if (content.trim().startsWith('<?xml') || /<[^>]+>/.test(content)) {
      try {
        return await this.xml(content)
      } catch {}
    }

    // Check for YAML
    if (/^[\w\s#-]+:/.test(content)) {
      try {
        return await this.yaml(content)
      } catch {}
    }

    // Check for Markdown
    if (content.includes('#') || content.includes('**') || content.includes('__')) {
      try {
        return await this.fromMarkdown(content)
      } catch {}
    }

    // Check for HTML
    if (/<[^>]+>/.test(content)) {
      try {
        return await this.fromHtml(content)
      } catch {}
    }

    // Fallback to raw text
    return JSON.stringify({ 
      type: 'text',
      content: content.trim()
    })
  }
}
