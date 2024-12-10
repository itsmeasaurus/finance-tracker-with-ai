class GeminiService {
  constructor() {
    this.apiKey = 'AIzaSyBLLP0CSVFAt2selUhsXWq3orNbQvE8yl4';
    this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  }

  async summarizeExpenses(data) {
    try {
      const prompt = `
        Please provide a brief summary of these financial expenses:
        Total Expenses: ${data.total}
        Monthly Budget: ${data.maxAmount}
        Currency: ${data.currency}
        Number of Transactions: ${data.expenses.length}
        Categories: ${data.categories.join(', ')}
        
        Please focus on:
        1. Whether the spending is over or under budget
        2. Main spending categories
        3. Any notable patterns
        
        Keep the response concise and friendly.
      `;

      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      const result = await response.json();
      return result.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return 'Unable to generate summary at this time.';
    }
  }
}

export const geminiService = new GeminiService(); 