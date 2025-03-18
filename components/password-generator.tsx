"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Copy,
  Check,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import { useToast } from "./hooks/use-toast";
import { ModeToggle } from "@/components/mode-toggle";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    generatePassword();
  }, []);

  useEffect(() => {
    calculatePasswordStrength();
  }, [password]);

  const generatePassword = () => {
    let charset = "";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (charset === "") {
      setPassword("");
      return;
    }

    let newPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }

    setPassword(newPassword);
    setCopied(false);
  };

  const calculatePasswordStrength = () => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;

    // Length contribution (up to 40%)
    strength += Math.min(40, (password.length / 20) * 40);

    // Character variety contribution (up to 60%)
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    const varietyCount = [hasLower, hasUpper, hasNumber, hasSymbol].filter(
      Boolean
    ).length;
    strength += (varietyCount / 4) * 60;

    setPasswordStrength(Math.round(strength));
  };

  const copyToClipboard = () => {
    if (!password) return;

    navigator.clipboard.writeText(password);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Password has been copied to your clipboard",
    });

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const getStrengthColor = () => {
    if (passwordStrength < 30) return "text-red-500";
    if (passwordStrength < 60) return "text-yellow-500";
    return "text-green-500";
  };

  const getStrengthIcon = () => {
    if (passwordStrength < 30)
      return <ShieldAlert className="h-5 w-5 text-red-500" />;
    if (passwordStrength < 60)
      return <Shield className="h-5 w-5 text-yellow-500" />;
    return <ShieldCheck className="h-5 w-5 text-green-500" />;
  };

  const getStrengthText = () => {
    if (passwordStrength < 30) return "Weak";
    if (passwordStrength < 60) return "Medium";
    return "Strong";
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
      <CardHeader className="relative">
        <div className="absolute right-6 top-6">
          <ModeToggle />
        </div>
        <CardTitle className="text-2xl font-bold">Password Generator</CardTitle>
        <CardDescription>Create secure, random passwords</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <Input
            value={password}
            readOnly
            className="pr-20 font-mono text-base h-12 bg-muted/50"
            placeholder="Your password will appear here"
          />
          <Button
            size="sm"
            variant="ghost"
            className="absolute right-1 top-1 h-10"
            onClick={copyToClipboard}
            disabled={!password}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Copy password</span>
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="length">Length: {length}</Label>
            <span className="flex items-center gap-1.5">
              {getStrengthIcon()}
              <span className={`text-sm font-medium ${getStrengthColor()}`}>
                {getStrengthText()}
              </span>
            </span>
          </div>
          <Slider
            id="length"
            min={4}
            max={32}
            step={1}
            value={[length]}
            onValueChange={(value) => setLength(value[0])}
            className="py-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="uppercase" className="cursor-pointer">
              Uppercase (A-Z)
            </Label>
            <Switch
              id="uppercase"
              checked={includeUppercase}
              onCheckedChange={setIncludeUppercase}
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="lowercase" className="cursor-pointer">
              Lowercase (a-z)
            </Label>
            <Switch
              id="lowercase"
              checked={includeLowercase}
              onCheckedChange={setIncludeLowercase}
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="numbers" className="cursor-pointer">
              Numbers (0-9)
            </Label>
            <Switch
              id="numbers"
              checked={includeNumbers}
              onCheckedChange={setIncludeNumbers}
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="symbols" className="cursor-pointer">
              Symbols (!@#$)
            </Label>
            <Switch
              id="symbols"
              checked={includeSymbols}
              onCheckedChange={setIncludeSymbols}
            />
          </div>
        </div>

        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              passwordStrength < 30
                ? "bg-red-500"
                : passwordStrength < 60
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
            style={{ width: `${passwordStrength}%` }}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full gap-2"
          onClick={generatePassword}
          disabled={
            !includeLowercase &&
            !includeUppercase &&
            !includeNumbers &&
            !includeSymbols
          }
        >
          <RefreshCw className="h-4 w-4" />
          Generate Password
        </Button>
      </CardFooter>
    </Card>
  );
}
