// 💻 CODE WORKSPACE - Revolutionary Multi-Agent Code Collaboration
// Real-time code editing and viewing with glassmorphism design

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeFile, Task } from '@/types/agents';
import { 
  Code, 
  File, 
  Folder, 
  Save, 
  Play, 
  GitBranch, 
  Eye, 
  Edit3,
  Download,
  Upload,
  RefreshCw,
  Minimize2,
  Maximize2,
  X
} from 'lucide-react';

interface CodeWorkspaceProps {
  isOpen: boolean;
  isMinimized: boolean;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  sessionId: string;
  codeFiles: CodeFile[];
  currentTasks: Task[];
  onFileChange: (filePath: string, content: string) => void;
  onRunCode: () => void;
  onSaveFiles: () => void;
}

const FILE_ICONS: { [key: string]: string } = {
  'tsx': '⚛️',
  'ts': '📘',
  'jsx': '⚛️',
  'js': '📄',
  'css': '🎨',
  'scss': '🎨',
  'html': '🌐',
  'json': '📋',
  'md': '📝',
  'yml': '⚙️',
  'yaml': '⚙️',
  'default': '📄'
};

export const CodeWorkspace: React.FC<CodeWorkspaceProps> = ({
  isOpen,
  isMinimized,
  onMinimize,
  onMaximize,
  onClose,
  sessionId,
  codeFiles,
  currentTasks,
  onFileChange,
  onRunCode,
  onSaveFiles
}) => {
  const [activeFile, setActiveFile] = useState<CodeFile | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    if (codeFiles.length > 0 && !activeFile) {
      setActiveFile(codeFiles[0]);
      setEditingContent(codeFiles[0].content);
    }
  }, [codeFiles, activeFile]);

  useEffect(() => {
    if (activeFile) {
      setEditingContent(activeFile.content);
      setUnsavedChanges(false);
    }
  }, [activeFile]);

  const handleFileSelect = (file: CodeFile) => {
    if (unsavedChanges) {
      const save = confirm('You have unsaved changes. Save before switching files?');
      if (save) {
        handleSaveFile();
      }
    }
    setActiveFile(file);
    setIsEditing(false);
  };

  const handleContentChange = (content: string) => {
    setEditingContent(content);
    setUnsavedChanges(content !== activeFile?.content);
  };

  const handleSaveFile = () => {
    if (activeFile && unsavedChanges) {
      onFileChange(activeFile.path, editingContent);
      setUnsavedChanges(false);
    }
  };

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase() || 'default';
    return FILE_ICONS[extension] || FILE_ICONS.default;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-500';
      case 'review': return 'bg-orange-500';
      case 'approved': return 'bg-green-500';
      case 'deprecated': return 'bg-red-500';
      default: return 'bg-muted';
    }
  };

  const formatFileSize = (content: string) => {
    const bytes = new Blob([content]).size;
    return bytes < 1024 ? `${bytes}B` : `${Math.round(bytes/1024)}KB`;
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed left-4 top-4 z-40 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-[calc(100vw-2rem)] h-[calc(100vh-2rem)] max-w-6xl max-h-[800px]'
    }`}>
      <Card className="glass h-full flex flex-col border-0 shadow-elevation">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/10">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-secondary text-secondary-foreground">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-medium gradient-text">Code Workspace</h3>
              <p className="text-xs text-muted-foreground">
                {codeFiles.length} files • {currentTasks.length} active tasks
              </p>
            </div>
            {unsavedChanges && (
              <Badge className="bg-yellow-500 text-yellow-50 animate-pulse">
                Unsaved
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={onSaveFiles}
              variant="ghost"
              size="sm"
              className="h-8 px-3 hover:bg-muted/50"
              disabled={!unsavedChanges}
            >
              <Save className="w-4 h-4 mr-2" />
              Save All
            </Button>
            <Button
              onClick={onRunCode}
              variant="ghost"
              size="sm"
              className="h-8 px-3 hover:bg-muted/50"
            >
              <Play className="w-4 h-4 mr-2" />
              Run
            </Button>
            <Button
              onClick={isMinimized ? onMaximize : onMinimize}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-muted/50"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-destructive/50 hover:text-destructive-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <div className="flex-1 flex">
              {/* File Explorer */}
              <div className="w-64 border-r border-border/10 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-sm">Files</h4>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Upload className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <ScrollArea className="h-[calc(100%-3rem)]">
                  <div className="space-y-1">
                    {codeFiles.map((file) => (
                      <div
                        key={file.path}
                        onClick={() => handleFileSelect(file)}
                        className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-all ${
                          activeFile?.path === file.path 
                            ? 'neuo-inset bg-primary/10' 
                            : 'hover:glass'
                        }`}
                      >
                        <span className="text-sm">{getFileIcon(file.path)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {file.path.split('/').pop()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatFileSize(file.content)} • v{file.version}
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(file.status)} text-white text-xs px-1`}>
                          {file.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Main Content */}
              <div className="flex-1 flex flex-col">
                {activeFile ? (
                  <Tabs defaultValue="code" className="flex-1">
                    <TabsList className="glass m-4 mb-0">
                      <TabsTrigger value="code" className="data-[state=active]:neuo">
                        <File className="w-4 h-4 mr-2" />
                        Code
                      </TabsTrigger>
                      <TabsTrigger value="preview" className="data-[state=active]:neuo">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </TabsTrigger>
                      <TabsTrigger value="tasks" className="data-[state=active]:neuo">
                        <GitBranch className="w-4 h-4 mr-2" />
                        Tasks
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="code" className="flex-1 m-4 mt-0">
                      <Card className="glass h-full p-0">
                        <div className="flex items-center justify-between p-4 border-b border-border/10">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{getFileIcon(activeFile.path)}</span>
                            <span className="font-medium">{activeFile.path}</span>
                            <Badge variant="outline" className="text-xs">
                              {activeFile.language}
                            </Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => setIsEditing(!isEditing)}
                              variant="ghost"
                              size="sm"
                              className="h-8"
                            >
                              <Edit3 className="w-4 h-4 mr-2" />
                              {isEditing ? 'View' : 'Edit'}
                            </Button>
                            {isEditing && (
                              <Button
                                onClick={handleSaveFile}
                                variant="ghost"
                                size="sm"
                                className="h-8"
                                disabled={!unsavedChanges}
                              >
                                <Save className="w-4 h-4 mr-2" />
                                Save
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="p-4 h-[calc(100%-5rem)]">
                          {isEditing ? (
                            <textarea
                              value={editingContent}
                              onChange={(e) => handleContentChange(e.target.value)}
                              className="w-full h-full resize-none bg-background/50 border border-border/20 rounded-lg p-4 font-mono text-sm focus:outline-none focus:glow transition-all"
                              style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
                            />
                          ) : (
                            <ScrollArea className="h-full">
                              <pre className="text-sm font-mono whitespace-pre-wrap">
                                {activeFile.content}
                              </pre>
                            </ScrollArea>
                          )}
                        </div>
                      </Card>
                    </TabsContent>

                    <TabsContent value="preview" className="flex-1 m-4 mt-0">
                      <Card className="glass h-full p-4">
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          <div className="text-center">
                            <Eye className="w-12 h-12 mx-auto mb-4" />
                            <p>Live preview coming soon...</p>
                            <p className="text-sm">Real-time code compilation and preview</p>
                          </div>
                        </div>
                      </Card>
                    </TabsContent>

                    <TabsContent value="tasks" className="flex-1 m-4 mt-0">
                      <Card className="glass h-full p-4">
                        <h4 className="font-medium mb-4">Active Tasks</h4>
                        <ScrollArea className="h-[calc(100%-3rem)]">
                          <div className="space-y-3">
                            {currentTasks.map((task) => (
                              <div key={task.id} className="p-3 rounded-lg neuo-inset">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-sm">{task.title}</span>
                                  <Badge className={`${
                                    task.status === 'completed' ? 'bg-green-500' :
                                    task.status === 'in_progress' ? 'bg-blue-500' :
                                    task.status === 'blocked' ? 'bg-red-500' :
                                    'bg-muted'
                                  } text-white text-xs`}>
                                    {task.status}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{task.description}</p>
                                <div className="flex items-center justify-between mt-2 text-xs">
                                  <span>Priority: {task.priority}</span>
                                  <span>Complexity: {task.estimatedComplexity}/10</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </Card>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Folder className="w-12 h-12 mx-auto mb-4" />
                      <p>No files available</p>
                      <p className="text-sm">Start a session to see generated code</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};