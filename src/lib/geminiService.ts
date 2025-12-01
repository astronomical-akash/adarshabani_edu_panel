import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GOOGLE_API_KEY || ''
const genAI = new GoogleGenerativeAI(apiKey)

export const geminiService = {
    async generateLatexFromText(text: string): Promise<string> {
        if (!apiKey) {
            throw new Error('GOOGLE_API_KEY is not configured')
        }

        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
            const prompt = `Convert the following text description into LaTeX math code. Return ONLY the LaTeX code, without any markdown formatting or explanations.
            
            Text: "${text}"
            
            LaTeX:`

            const result = await model.generateContent(prompt)
            const response = await result.response
            let latex = response.text()

            // Clean up any markdown code blocks if present
            latex = latex.replace(/```latex/g, '').replace(/```/g, '').trim()

            // Remove $ delimiters if present, as we add them in the editor
            if (latex.startsWith('$') && latex.endsWith('$')) {
                latex = latex.slice(1, -1)
            }
            if (latex.startsWith('$$') && latex.endsWith('$$')) {
                latex = latex.slice(2, -2)
            }

            return latex
        } catch (error) {
            console.error('Gemini API Error:', error)
            throw new Error('Failed to generate LaTeX from text')
        }
    },

    async autoFormatDocument(text: string): Promise<string> {
        if (!apiKey) {
            throw new Error('GOOGLE_API_KEY is not configured')
        }

        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
            const prompt = `You are an intelligent document formatter. Your task is to scan the following HTML content and convert any plain text mathematical expressions or variables into LaTeX format (wrapped in $...$).
            
            Rules:
            1. Convert variables like "x", "y", "theta" to "$x$", "$y$", "$\\theta$" where appropriate in context.
            2. Convert expressions like "x^2", "1/2", "sqrt(x)" to "$x^2$", "$\\frac{1}{2}$", "$\\sqrt{x}$".
            3. Do NOT modify any HTML tags, attributes, or structure. Only modify the text content.
            4. Do NOT modify headings (h1-h6) unless they contain explicit math.
            5. Return the full HTML with LaTeX replacements.
            
            HTML:
            ${text}
            `

            const result = await model.generateContent(prompt)
            const response = await result.response
            return response.text()
        } catch (error) {
            console.error('Gemini API Error:', error)
            throw new Error('Failed to auto-format document')
        }
    }
}
