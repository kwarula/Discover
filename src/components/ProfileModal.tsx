
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { UserProfile } from '@/types';
import { toast } from '@/hooks/use-toast';
import { LogOut } from 'lucide-react';

export const ProfileModal: React.FC = () => {
  const { isProfileModalOpen, setIsProfileModalOpen, userProfile, setUserProfile } = useAppContext();
  const [formData, setFormData] = useState<UserProfile>({
    username: '',
    travelStyle: 'adventure',
    interests: [],
    preferredLanguage: 'English',
  });

  useEffect(() => {
    if (userProfile) {
      setFormData(userProfile);
    }
  }, [userProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username.",
        variant: "destructive",
      });
      return;
    }

    setUserProfile(formData);
    setIsProfileModalOpen(false);
    toast({
      title: "Profile updated!",
      description: "Your preferences have been saved.",
    });
  };

  const handleSignOut = () => {
    setUserProfile(null);
    setIsProfileModalOpen(false);
    toast({
      title: "Signed out",
      description: "Come back anytime to continue exploring Diani!",
    });
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const availableInterests = [
    'Diving', 'Snorkeling', 'Local Cuisine', 'Wildlife', 'Photography', 
    'Beach Activities', 'Cultural Experiences', 'Nightlife', 'Wellness', 'Adventure Sports'
  ];

  return (
    <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
      <DialogContent className="sm:max-w-[500px] bg-diani-sand-50 border-diani-sand-200 rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold font-sohne text-diani-sand-900 text-center">
            Your Profile
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-diani-sand-700">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="SafariExplorer"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              className="bg-white border-diani-sand-300 focus:border-diani-teal-500 focus:ring-diani-teal-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="travelStyle" className="text-sm font-medium text-diani-sand-700">
              Travel Style
            </Label>
            <Select
              value={formData.travelStyle}
              onValueChange={(value: UserProfile['travelStyle']) => 
                setFormData(prev => ({ ...prev, travelStyle: value }))
              }
            >
              <SelectTrigger className="bg-white border-diani-sand-300 focus:border-diani-teal-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-diani-sand-200">
                <SelectItem value="adventure">Adventure Seeker</SelectItem>
                <SelectItem value="relaxed">Relaxed Explorer</SelectItem>
                <SelectItem value="family">Family Traveler</SelectItem>
                <SelectItem value="luxury">Luxury Enthusiast</SelectItem>
                <SelectItem value="budget">Budget Conscious</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-diani-sand-700">
              Interests
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {availableInterests.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                    formData.interests.includes(interest)
                      ? 'bg-diani-teal-500 text-white border-diani-teal-500'
                      : 'bg-white text-diani-sand-700 border-diani-sand-300 hover:border-diani-teal-500'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t border-diani-sand-200">
            <Button
              type="submit"
              className="w-full bg-diani-teal-500 hover:bg-diani-teal-700 text-white rounded-full py-3 font-medium transition-all duration-200"
            >
              Save Changes
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleSignOut}
              className="w-full border-coral-sunset-500 text-coral-sunset-600 hover:bg-coral-sunset-50 rounded-full py-3 font-medium transition-all duration-200"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
