'use client'

import { useState } from 'react'
import { MessageSquare, Github, Send, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentRepo, setCurrentRepo] = useState<string | null>(null)

  const handleRepoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!repoUrl.trim()) return

    setCurrentRepo(repoUrl)
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `Please analyze this GitHub repository: ${repoUrl}`,
      timestamp: new Date()
    }

    setMessages([userMessage])
    await analyzeRepo(userMessage.content)
    setRepoUrl('')
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    await analyzeRepo(userMessage.content)
  }

  const analyzeRepo = async (prompt: string) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages,
            { role: 'user', content: prompt }
          ],
          currentRepo,
          systemPrompt: 'You are Explain GitHub repos with Nia, a next.js repository chat with nia mcp-backed github analysis. You help users understand GitHub repositories by analyzing their code structure, dependencies, architecture, and providing detailed explanations. Be thorough, clear, and provide actionable insights.'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to analyze repository')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error while analyzing the repository. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <img
                src="/logo.svg"
                alt="Z.ai Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                GitHub Repo Analyzer
              </h1>
              <p className="text-sm text-muted-foreground">AI-powered repository insights</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-5xl">
        {!currentRepo ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Github className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Analyze GitHub Repositories</h2>
                <p className="text-muted-foreground max-w-md">
                  Enter a GitHub repository URL and I'll help you understand its structure, dependencies, and architecture
                </p>
              </div>
            </div>

            <form onSubmit={handleRepoSubmit} className="w-full max-w-2xl">
              <Card className="p-4">
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="https://github.com/username/repo"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button type="submit" disabled={isLoading || !repoUrl.trim()}>
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Analyze
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
              {[
                { icon: Sparkles, title: 'Smart Analysis', desc: 'Understand code structure and patterns' },
                { icon: MessageSquare, title: 'Interactive Chat', desc: 'Ask follow-up questions' },
                { icon: Github, title: 'Deep Insights', desc: 'Explore architecture and dependencies' }
              ].map((feature, idx) => (
                <Card key={idx} className="p-4">
                  <feature.icon className="w-6 h-6 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Current Repository */}
            <Card className="p-4 bg-primary/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Github className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">{currentRepo}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCurrentRepo(null)
                    setMessages([])
                  }}
                >
                  New Repository
                </Button>
              </div>
            </Card>

            {/* Chat Messages */}
            <Card className="p-4">
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg px-4 py-3 bg-muted">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Analyzing repository...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </Card>

            {/* Message Input */}
            <form onSubmit={handleSendMessage}>
              <Card className="p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask a question about this repository..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading || !inputMessage.trim()}>
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              Powered by AI • GitHub Repository Analysis
            </p>
            <p className="text-sm text-muted-foreground">
              Built with Next.js, TypeScript, and shadcn/ui
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}