/**
 * Convert URLs in text to clickable links
 */

export function linkifyUrls(text: string): string {
  if (!text) return ''

  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g

  return text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline break-all">${url}</a>`
  })
}
