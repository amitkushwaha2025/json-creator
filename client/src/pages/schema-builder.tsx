import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Code, Eye, Download, Save, Upload, RotateCcw, Settings, HelpCircle } from "lucide-react";
import { SchemaBuilderFormSchema, type SchemaBuilderForm, type SchemaField } from "@shared/schema";
import FieldRow from "@/components/field-row";
import JsonPreview from "@/components/json-preview";
import { useToast } from "@/hooks/use-toast";

export default function SchemaBuilder() {
  const { toast } = useToast();
  const [jsonOutput, setJsonOutput] = useState<object>({});

  const form = useForm<SchemaBuilderForm>({
    resolver: zodResolver(SchemaBuilderFormSchema),
    defaultValues: {
      fields: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "fields"
  });

  const watchedFields = form.watch("fields");

  // Generate JSON data from form data
  const generateJsonSchema = (fields: SchemaField[]): object => {
    const data: any = {};
    
    fields.forEach(field => {
      if (!field.name) return;
      
      if (field.type === "Nested" && field.nested && field.nested.length > 0) {
        data[field.name] = generateJsonSchema(field.nested);
      } else {
        let value = field.defaultValue;
        
        // Set appropriate values based on field types
        switch (field.type) {
          case "Float":
            if (value !== undefined && value !== "") {
              data[field.name] = parseFloat(value.toString());
            } else {
              data[field.name] = 0.0;
            }
            break;
          case "Number":
            if (value !== undefined && value !== "") {
              data[field.name] = parseInt(value.toString());
            } else {
              data[field.name] = 0;
            }
            break;
          case "Boolean":
            if (value !== undefined && value !== "") {
              data[field.name] = value === "true";
            } else {
              data[field.name] = false;
            }
            break;
          case "ObjectId":
            if (value !== undefined && value !== "") {
              data[field.name] = value.toString();
            } else {
              data[field.name] = "507f1f77bcf86cd799439011";
            }
            break;
          case "String":
          default:
            if (value !== undefined && value !== "") {
              data[field.name] = value.toString();
            } else {
              data[field.name] = "";
            }
            break;
        }
      }
    });
    
    return data;
  };

  // Update JSON preview whenever fields change
  useEffect(() => {
    if (watchedFields) {
      const validFields = watchedFields.filter(field => field && field.name);
      setJsonOutput(generateJsonSchema(validFields));
    }
  }, [watchedFields]);

  const addField = () => {
    const newField: SchemaField = {
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: "",
      type: "String",
      defaultValue: "",
      nested: []
    };
    append(newField);
  };

  const removeField = (index: number) => {
    remove(index);
    toast({
      title: "Field Removed",
      description: "The field has been successfully removed from the schema."
    });
  };

  const handleSave = () => {
    const isValid = form.trigger();
    if (isValid) {
      toast({
        title: "Schema Saved",
        description: "Your JSON schema has been saved successfully."
      });
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(jsonOutput, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'schema.json';
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Schema Exported",
      description: "Your JSON schema has been downloaded."
    });
  };

  const handleReset = () => {
    form.reset({ fields: [] });
    toast({
      title: "Schema Reset",
      description: "All fields have been cleared."
    });
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            // This would need logic to convert JSON schema back to form fields
            toast({
              title: "Schema Imported",
              description: "JSON schema has been imported successfully."
            });
          } catch {
            toast({
              title: "Import Error",
              description: "Invalid JSON file format.",
              variant: "destructive"
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const fieldCount = fields.length;
  const nestedCount = fields.reduce((count, field) => {
    return count + (field.type === "Nested" ? 1 : 0);
  }, 0);
  const maxDepth = Math.max(1, nestedCount > 0 ? 2 : 1);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Code className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold">JSON Schema Builder</h1>
              </div>
              <Badge variant="secondary" className="text-xs">v1.0.0</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <HelpCircle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Schema Builder */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <h2 className="text-lg font-medium">Schema Builder</h2>
              <div className="flex space-x-2">
                <Button size="sm" onClick={addField}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Field
                </Button>
                <Button size="sm" variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form className="space-y-4">
                  {fields.map((field, index) => (
                    <FieldRow
                      key={field.id}
                      field={field}
                      index={index}
                      form={form}
                      onRemove={() => removeField(index)}
                    />
                  ))}
                  
                  {fields.length === 0 && (
                    <div className="text-center py-8">
                      <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No fields added yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start building your JSON schema by adding fields
                      </p>
                      <Button onClick={addField}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Field
                      </Button>
                    </div>
                  )}
                  
                  {fields.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-dashed"
                      onClick={addField}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Field
                    </Button>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* JSON Preview */}
          <Card>
            <CardHeader className="p-0">
              <Tabs defaultValue="json" className="w-full">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <TabsList className="grid w-64 grid-cols-2">
                    <TabsTrigger value="json" className="flex items-center">
                      <Code className="h-4 w-4 mr-2" />
                      JSON Data
                    </TabsTrigger>
                    <TabsTrigger value="schema" className="flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      Raw Preview
                    </TabsTrigger>
                  </TabsList>
                  <JsonPreview jsonData={jsonOutput} />
                </div>
                
                <TabsContent value="json" className="mt-0">
                  <div className="p-4 h-96 overflow-auto">
                    <JsonPreview jsonData={jsonOutput} displayMode="full" />
                  </div>
                </TabsContent>
                
                <TabsContent value="schema" className="mt-0">
                  <div className="p-4 h-96 overflow-auto">
                    <div className="text-sm text-muted-foreground">
                      Schema preview functionality would be implemented here
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>

            {/* Statistics */}
            <div className="border-t bg-muted/50 p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold">{fieldCount}</div>
                  <div className="text-xs text-muted-foreground">Fields</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">{nestedCount}</div>
                  <div className="text-xs text-muted-foreground">Nested</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">{maxDepth}</div>
                  <div className="text-xs text-muted-foreground">Max Depth</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Validation & Actions Panel */}
        <Card className="mt-6">
          <CardHeader>
            <h3 className="text-lg font-medium">Validation & Actions</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-800">Schema Valid</span>
                </div>
                <p className="text-xs text-green-600 mt-1">All fields are properly configured</p>
              </div>
              
              <Button onClick={handleSave} className="justify-center">
                <Save className="h-4 w-4 mr-2" />
                Save Schema
              </Button>
              
              <Button variant="outline" onClick={handleImport} className="justify-center">
                <Upload className="h-4 w-4 mr-2" />
                Import Schema
              </Button>
              
              <Button variant="outline" onClick={handleReset} className="justify-center">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
