import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EditAuthor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [authorData, setAuthorData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    nationality: "",
    profilePic: "",
    shortBio: "",
    languagesKnown: "",
  });

  useEffect(() => {
    // Load author data based on ID
    // This would typically fetch from an API
    const dummyData = {
      name: "Rajesh Kumar",
      email: "rajesh@email.com",
      phone: "+91 9876543210",
      dob: "1975-06-15",
      gender: "male",
      nationality: "Indian",
      profilePic: "",
      shortBio: "Renowned Tamil author with 20+ years of experience",
      languagesKnown: "Tamil, English, Hindi",
    };
    setAuthorData(dummyData);
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update author logic here
    toast({
      title: "Success",
      description: "Author Updated Successfully",
    });
    navigate("/masters/author");
  };

  const handleInputChange = (field: string, value: string) => {
    setAuthorData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/masters/author")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Authors
        </Button>
        <h1 className="text-3xl font-bold text-primary">Edit Author</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Author Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Author Name *</Label>
              <Input
                id="name"
                value={authorData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={authorData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={authorData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={authorData.dob}
                onChange={(e) => handleInputChange("dob", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={authorData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={authorData.nationality}
                onChange={(e) => handleInputChange("nationality", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profilePic">Profile Picture URL</Label>
              <Input
                id="profilePic"
                value={authorData.profilePic}
                onChange={(e) => handleInputChange("profilePic", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="languagesKnown">Languages Known</Label>
              <Input
                id="languagesKnown"
                value={authorData.languagesKnown}
                onChange={(e) => handleInputChange("languagesKnown", e.target.value)}
                placeholder="e.g., Tamil, English, Hindi"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="shortBio">Short Bio</Label>
              <Textarea
                id="shortBio"
                value={authorData.shortBio}
                onChange={(e) => handleInputChange("shortBio", e.target.value)}
                rows={4}
              />
            </div>

            <div className="md:col-span-2 flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                Update Author
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/masters/author")}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditAuthor;