import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useImageGen() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateImage = useCallback(async (prompt: string): Promise<string | null> => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: { prompt },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      return data?.imageUrl || null;
    } catch (e: any) {
      console.error("Image gen error:", e);
      toast({ variant: "destructive", title: "Image generation failed", description: e.message });
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);

  return { generateImage, isGenerating };
}
