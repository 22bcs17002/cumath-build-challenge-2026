"use client"

import { Moon, Sun, Settings, Key, Globe } from "lucide-react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { ApiKeys } from "@/lib/types"
import { toast } from "sonner"
import { encryptApiKeys } from "@/lib/encryption"

interface HeaderAreaProps {
  theme: string
  setTheme: (theme: string) => void
  apiKeysOpen: boolean
  setApiKeysOpen: (open: boolean) => void
  apiKeys: ApiKeys
  setApiKeys: (keys: ApiKeys) => void
  openAIBaseURL: string
  setOpenAIBaseURL: (url: string) => void
}

export const HeaderArea = ({
  theme,
  setTheme,
  apiKeysOpen,
  setApiKeysOpen,
  apiKeys,
  setApiKeys,
  openAIBaseURL,
  setOpenAIBaseURL,
}: HeaderAreaProps) => {

  const handleSaveKeys = () => {
    try {
      const encrypted = encryptApiKeys(apiKeys);
      localStorage.setItem("ai-api-keys", JSON.stringify(encrypted));
      localStorage.setItem("openai-base-url", openAIBaseURL);
      setApiKeysOpen(false);
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings.");
    }
  }

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Cuemath Social Media Studio
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setApiKeysOpen(true)}>
          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </Button>
      </div>

      {/* Settings Dialog (Integrated Fix) */}
      <Dialog open={apiKeysOpen} onOpenChange={setApiKeysOpen}>
        <DialogContent className="sm:max-w-[425px] dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl dark:text-white">
              <Settings className="w-5 h-5" /> Studio Settings
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Configure your API keys and endpoints here. They are encrypted and stored locally.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="gemini" className="flex items-center gap-2 font-semibold dark:text-gray-200">
                <Key className="w-4 h-4 text-blue-500" /> Google Gemini API Key
              </Label>
              <Input
                id="gemini"
                type="password"
                placeholder="Paste your Gemini key..."
                value={apiKeys.gemini}
                onChange={(e) => setApiKeys({ ...apiKeys, gemini: e.target.value })}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="openai" className="flex items-center gap-2 font-semibold dark:text-gray-200">
                <Key className="w-4 h-4 text-green-500" /> OpenAI API Key (Optional)
              </Label>
              <Input
                id="openai"
                type="password"
                placeholder="Paste your OpenAI key..."
                value={apiKeys.openai}
                onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="baseurl" className="flex items-center gap-2 font-semibold dark:text-gray-200">
                <Globe className="w-4 h-4 text-purple-500" /> OpenAI Base URL
              </Label>
              <Input
                id="baseurl"
                placeholder="https://api.openai.com/v1"
                value={openAIBaseURL}
                onChange={(e) => setOpenAIBaseURL(e.target.value)}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSaveKeys} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  )
}