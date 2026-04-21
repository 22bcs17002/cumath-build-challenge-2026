/**
 * Configuration for available LLM models in the Cuemath Social Media Studio
 */

export interface LLMModel {
    id: string;
    name: string;
    provider: string;
    available: boolean;
}

/**
 * Single working model for the 2026 Build Challenge
 */
export const AVAILABLE_MODELS: LLMModel[] = [
    {
        id: "gemini-2.5-flash",
        name: "Gemini 2.5 Flash",
        provider: "Google",
        available: true,
    }
]

/**
 * Get a specific model by its ID
 */
export function getModelById(modelId: string): LLMModel | undefined {
    return AVAILABLE_MODELS.find((model) => model.id === modelId);
}

/**
 * Get only the models that are currently available/enabled
 */
export function getAvailableModels(): LLMModel[] {
    return AVAILABLE_MODELS.filter((model) => model.available);
}