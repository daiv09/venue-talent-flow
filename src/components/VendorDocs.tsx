import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const VendorDocuments = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const uploadDoc = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const { data: userData } = await supabase.auth.getUser();
    const vendorId = userData.user?.id;
    if (!vendorId) return;

    const filePath = `${vendorId}/${docType}-${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage.from("vendor-documents").upload(filePath, file);

    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
    } else {
      const { error } = await supabase.from("vendor_documents").insert({
        vendor_id: vendorId,
        doc_type: docType,
        file_url: filePath,
      });
      if (error) {
        toast({ title: "DB insert failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Document uploaded", description: "Pending admin verification." });
      }
    }

    setUploading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Upload Government ID (e.g., PAN / Aadhaar)</Label>
          <Input type="file" accept="image/*,application/pdf" onChange={(e) => uploadDoc(e, "GovID")} disabled={uploading} />
        </div>
        <div>
          <Label>Upload Business License / GST</Label>
          <Input type="file" accept="image/*,application/pdf" onChange={(e) => uploadDoc(e, "Business")} disabled={uploading} />
        </div>
      </CardContent>
    </Card>
  );
};
export default VendorDocuments;