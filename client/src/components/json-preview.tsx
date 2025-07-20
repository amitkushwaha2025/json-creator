import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download, AlignLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JsonPreviewProps {
  jsonData: object;
  displayMode?: "full" | "actions-only";
}

export default function JsonPreview({ jsonData, displayMode = "actions-only" }: JsonPreviewProps) {
  const { toast } = useToast();
  const [formattedJson, setFormattedJson] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const formatted = JSON.stringify(jsonData, null, 2);
    setFormattedJson(formatted);
  }, [jsonData]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedJson);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "JSON schema has been copied to your clipboard."
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    const dataBlob = new Blob([formattedJson], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'schema.json';
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your JSON schema is being downloaded."
    });
  };

  const handleFormat = () => {
    setFormattedJson(JSON.stringify(jsonData, null, 2));
    toast({
      title: "JSON formatted",
      description: "JSON has been formatted for better readability."
    });
  };

  // Syntax highlighting
  const syntaxHighlight = (json: string) => {
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = 'number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key';
          } else {
            cls = 'string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean';
        } else if (/null/.test(match)) {
          cls = 'null';
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  };

  if (displayMode === "actions-only") {
    return (
      <div className="flex space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="text-muted-foreground hover:text-foreground"
        >
          {copied ? <div className="w-4 h-4 text-green-500">✓</div> : <Copy className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFormat}
          className="text-muted-foreground hover:text-foreground"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          className="text-muted-foreground hover:text-foreground"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <pre 
        className="json-preview text-sm leading-relaxed syntax-highlight whitespace-pre-wrap break-words"
        dangerouslySetInnerHTML={{ 
          __html: formattedJson ? syntaxHighlight(formattedJson) : '{}' 
        }}
      />
      {Object.keys(jsonData).length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          <div className="text-4xl mb-2">📄</div>
          <p className="text-sm">No fields added yet</p>
          <p className="text-xs">Add fields to see the JSON preview</p>
        </div>
      )}
    </div>
  );
}
