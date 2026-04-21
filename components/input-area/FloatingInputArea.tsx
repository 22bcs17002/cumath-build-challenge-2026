import { useState } from "react";
import { ArrowUp, Instagram, Linkedin, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { getAvailableModels, type LLMModel } from "@/lib/models";
import { ContentConfig } from "./ContentConfig";
import { UserConfig } from "@/lib/types";

interface FloatingInputAreaProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  prompt: string;
  setPrompt: (value: string) => void;
  generateContent: () => void;
  selectedPlatforms: string[];
  togglePlatform: (platform: string) => void;
  selectedModel: LLMModel;
  setSelectedModel: (value: LLMModel) => void;
  isGenerating: boolean;
  userConfig: UserConfig;
  setUserConfig: (config: UserConfig | ((prev: UserConfig) => UserConfig)) => void;
}

// Updated constants to include all valid types and resolve TypeScript overlap errors
const platformIcons = {
  linkedin: Linkedin,
  reddit: MessageCircle,
  twitter: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  "instagram carousel": ({ className }: { className?: string }) => (
    <Instagram className={`${className} text-pink-500`} />
  ),
};

const platformColors = {
  linkedin: "bg-indigo-600 hover:bg-indigo-700 text-white",
  reddit: "bg-orange-600 hover:bg-orange-700 text-white",
  twitter: "bg-black hover:bg-gray-800 text-white",
  "instagram carousel": "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0",
};

const platformNames = {
  linkedin: "LinkedIn",
  reddit: "Reddit",
  twitter: "Twitter",
  "instagram carousel": "Instagram Carousel",
};

export const FloatingInputArea = ({
  textareaRef,
  prompt,
  setPrompt,
  generateContent,
  selectedPlatforms,
  togglePlatform,
  selectedModel,
  setSelectedModel,
  isGenerating,
  userConfig,
  setUserConfig,
}: FloatingInputAreaProps) => {
  const [configOpen, setConfigOpen] = useState(false);
  const modelOptions = getAvailableModels();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateContent();
    }
  };

  const handleModelChange = (modelId: string) => {
    const model = modelOptions.find(m => m.id === modelId);
    if (model) {
      setSelectedModel(model);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-2">
        {/* Textarea */}
        <Textarea
          ref={textareaRef}
          placeholder="What content would you like to generate for your social media platforms?"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
          className="min-h-[60px] border-0 resize-none focus-visible:ring-0 text-base placeholder:text-gray-500 dark:placeholder:text-gray-400 dark:bg-gray-800 dark:text-white"
        />

        {/* Controls Row */}
        <div className="flex items-center justify-between mt-4">
          {/* Left Side - Config and Platform Buttons */}
          <div className="flex items-center gap-2">

            {/* Config Button */}
            <ContentConfig 
              configOpen={configOpen}
              setConfigOpen={setConfigOpen}
              userConfig={userConfig}
              setUserConfig={setUserConfig}
              platformNames={platformNames}
            />

            {/* Branded Instagram Carousel Button */}
            {(["instagram carousel"] as const).map((platform) => {
              const IconComponent = platformIcons[platform];
              // Force selection for the studio display
              const isSelected = true; 
              return (
                <Button
                  key={platform}
                  variant="default"
                  size="sm"
                  onClick={() => togglePlatform(platform)}
                  className={`h-8 px-3 ${platformColors[platform]}`}
                >
                  <IconComponent className="w-4 h-4 mr-1" />
                  <span className="sm:inline">{platformNames[platform]}</span>
                </Button>
              );
            })}

          </div>

          {/* Right Side - Model Selection and Send Button */}
          <div className="flex items-center gap-2">
            <Select value={selectedModel.id} onValueChange={handleModelChange}>
              <SelectTrigger className="w-32 h-8 border-0 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                {modelOptions.map((model: LLMModel) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={generateContent}
              disabled={isGenerating}
              size="sm"
              className="h-8 w-8 p-0 rounded-full"
            >
              {isGenerating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowUp className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};