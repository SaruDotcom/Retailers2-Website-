import { useState } from "react";
import { Link, useNavigate } from "@/lib/router";
import { toast } from "sonner";
import {
  ArrowLeft,
  Verified,
  Business,
  Check,
  Visibility,
  VisibilityOff,
  AccountBalance,
  Lock,
  LocationOn,
  VerifiedUser,
  Person,
} from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { categories, type RetailerProfile } from "@/data/mock";
import { useStore } from "@/state/store";

type Fields = RetailerProfile & { password: string; confirmPassword: string };
type Errors = Partial<Record<keyof Fields | "terms", string>>;

const businessTypes = [
  "Independent retailer",
  "Kirana / general store",
  "Supermarket / mini-mart",
  "Specialty store",
  "Wholesale reseller",
  "Online seller",
];

const states = [
  "Andhra Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Odisha","Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","Uttarakhand","West Bengal",
];

const empty: Fields = {
  businessName: "", ownerName: "", phone: "", email: "",
  gstRegistered: false, gstNumber: "", businessType: "", category: "",
  address: "", city: "", state: "", pincode: "",
  password: "", confirmPassword: "",
};

function passwordStrength(pw: string): { score: number; label: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["Too weak", "Weak", "Fair", "Good", "Strong", "Excellent"];
  return { score, label: labels[score] ?? "" };
}

function validate(f: Fields, terms: boolean, step: number): Errors {
  const e: Errors = {};
  if (step === 1) {
    if (f.businessName.trim().length < 3) e.businessName = "Business name must be at least 3 characters long";
    if (!f.businessType) e.businessType = "Please select a business type";
    if (!f.category) e.category = "Please select a main category";
  }
  if (step === 2) {
    if (f.gstRegistered && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(f.gstNumber.trim().toUpperCase()))
      e.gstNumber = "Please enter a valid 15-character GSTIN (e.g. 06AABCK1234M1ZP)";
  }
  if (step === 3) {
    if (f.ownerName.trim().length < 3) e.ownerName = "Please enter the owner's full name";
    if (!/^[+]?[0-9\s-]{10,15}$/.test(f.phone.trim())) e.phone = "Please enter a valid 10-digit mobile number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "Please enter a valid email address";
    if (f.address.trim().length < 5) e.address = "Please enter your shop or warehouse address";
    if (f.city.trim().length < 2) e.city = "Please enter your city name";
    if (!f.state) e.state = "Please select a state";
    if (!/^[1-9][0-9]{5}$/.test(f.pincode.trim())) e.pincode = "Please enter a valid 6-digit pincode";
  }
  if (step === 4) {
    if (f.password.length < 8) e.password = "Password must be at least 8 characters long";
    if (f.confirmPassword !== f.password) e.confirmPassword = "Passwords do not match";
    if (!terms) e.terms = "Please accept the terms to continue";
  }
  return e;
}

function Field({ label, error, children, optional }: { label: string; error?: string | undefined; children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-ink">
      <span className="flex items-baseline justify-between">
        {label}
        {optional && <span className="text-xs font-normal text-muted-foreground">Optional</span>}
      </span>
      <div className="mt-2">{children}</div>
      {error && <span className="mt-1.5 block text-xs font-medium text-destructive">{error}</span>}
    </label>
  );
}

function Section({ icon: Icon, step, title, subtitle }: { icon: React.ElementType; step: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3 border-b pb-4">
      <span className="grid size-10 shrink-0 place-items-center bg-secondary text-primary"><Icon className="size-5" /></span>
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-primary">{step}</p>
        <h2 className="text-lg font-extrabold text-ink">{title}</h2>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { saveProfile } = useStore();
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [terms, setTerms] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [done, setDone] = useState(false);

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const strength = passwordStrength(fields.password);

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const found = validate(fields, terms, currentStep);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      toast.error("Please correct the errors in the form before continuing");
      return;
    }
    if (currentStep < 4) {
      setCurrentStep((step) => step + 1);
      return;
    }
    const { password: _pw, confirmPassword: _cpw, ...profile } = fields;
    saveProfile({ ...profile, gstNumber: profile.gstNumber.toUpperCase() });
    setDone(true);
    toast.success("Account created successfully — Welcome to NEXORA!");
  };

  if (done) {
    return (
      <main className="grid min-h-[calc(100vh-120px)] place-items-center bg-canvas px-4 py-12">
        <section className="w-full max-w-md border bg-card p-8 text-center shadow-sm">
          <span className="mx-auto grid size-14 place-items-center bg-success/10 text-success"><Verified className="size-8" /></span>
          <h1 className="mt-5 text-2xl font-extrabold text-ink">Account Ready!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Retailer account created for <strong className="text-ink">{fields.businessName}</strong>. You can now discover wholesalers by category, send connection requests, and unlock their trade catalogs.
          </p>
          <div className="mt-6 grid gap-2">
            <Button size="lg" onClick={() => navigate({ to: "/categories" })}>Browse Wholesalers by Category</Button>
            <Button size="lg" variant="outline" onClick={() => navigate({ to: "/dashboard" })}>Go to Dashboard</Button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-canvas px-4 py-10">
      <section className="mx-auto w-full max-w-2xl">
        <div className="text-center">
          <span className="mx-auto grid size-11 place-items-center bg-primary font-extrabold text-primary-foreground">N</span>
          <h1 className="mt-5 text-2xl font-extrabold text-ink sm:text-3xl">Create your retailer account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Fill in your details to connect with verified wholesalers and start ordering products.
          </p>
        </div>

        <form className="mt-8 grid gap-8 border bg-card p-6 shadow-sm sm:p-8" onSubmit={submit} noValidate>
          {/* Business details */}
          {currentStep === 1 && <div className="grid gap-5">
            <Section icon={Business} step="Step 1 of 4" title="Business details" subtitle="Basic information about your store or firm" />
            <Field label="Business / shop name" error={errors.businessName}>
              <Input value={fields.businessName} onChange={(e) => set("businessName", e.target.value)} placeholder="e.g. Kapoor General Store" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Business type" error={errors.businessType}>
                <Select fullWidth size="small" displayEmpty value={fields.businessType} onChange={(e) => set("businessType", e.target.value)}>
                  <MenuItem value=""><em>Select business type</em></MenuItem>
                  {businessTypes.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
              </Field>
              <Field label="Main buying category" error={errors.category}>
                <Select fullWidth size="small" displayEmpty value={fields.category} onChange={(e) => set("category", e.target.value)}>
                  <MenuItem value=""><em>Select category</em></MenuItem>
                  {categories.map((c) => <MenuItem key={c.id} value={c.name ?? ""}>{c.name}</MenuItem>)}
                </Select>
              </Field>
            </div>
          </div>}

          {/* GST */}
          {currentStep === 2 && <div className="grid gap-5">
            <Section icon={AccountBalance} step="Step 2 of 4" title="Tax registration" subtitle="Whether GST-registered or non-GST, both are welcome" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {([false, true] as const).map((v) => (
                <button
                  key={String(v)}
                  type="button"
                  onClick={() => set("gstRegistered", v)}
                  className={`flex items-center gap-3 border p-4 text-left transition interactive ${fields.gstRegistered === v ? "border-primary bg-accent" : "hover:border-primary/40"}`}
                >
                  <span className={`grid size-5 shrink-0 place-items-center border ${fields.gstRegistered === v ? "border-primary bg-primary text-primary-foreground" : "border-input"}`}>
                    {fields.gstRegistered === v && <Check className="size-3.5" />}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-ink">{v ? "GST registered" : "Non-GST business"}</span>
                    <span className="block text-xs text-muted-foreground">{v ? "I have a valid GSTIN" : "No GST registration currently"}</span>
                  </span>
                </button>
              ))}
            </div>
            {fields.gstRegistered && (
              <Field label="GSTIN (15 characters)" error={errors.gstNumber}>
                <Input value={fields.gstNumber} onChange={(e) => set("gstNumber", e.target.value.toUpperCase())} placeholder="e.g. 06AABCK1234M1ZP" maxLength={15} className="uppercase" />
              </Field>
            )}
            {!fields.gstRegistered && (
              <p className="border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                No problem — non-GST retailers can also use NEXORA. You can add a GSTIN later in Settings.
              </p>
            )}
          </div>}

          {/* Owner & contact */}
          {currentStep === 3 && <div className="grid gap-5">
            <Section icon={Person} step="Step 3 of 4" title="Owner & contact" subtitle="Who manages the account and how to contact you" />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Owner full name" error={errors.ownerName}>
                <Input value={fields.ownerName} onChange={(e) => set("ownerName", e.target.value)} placeholder="e.g. Amit Kapoor" />
              </Field>
              <Field label="Mobile number" error={errors.phone}>
                <Input value={fields.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98765 43210" inputMode="tel" />
              </Field>
            </div>
            <Field label="Email address" error={errors.email}>
              <Input type="email" value={fields.email} onChange={(e) => set("email", e.target.value)} placeholder="you@business.com" />
            </Field>
            <Field label="Shop / godown address" error={errors.address}>
              <Input value={fields.address} onChange={(e) => set("address", e.target.value)} placeholder="Shop no., street, area" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="City" error={errors.city}>
                <Input value={fields.city} onChange={(e) => set("city", e.target.value)} placeholder="Gurugram" />
              </Field>
              <Field label="State" error={errors.state}>
                <Select fullWidth size="small" displayEmpty value={fields.state} onChange={(e) => set("state", e.target.value)}>
                  <MenuItem value=""><em>Select state</em></MenuItem>
                  {states.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              </Field>
              <Field label="Pincode" error={errors.pincode}>
                <Input value={fields.pincode} onChange={(e) => set("pincode", e.target.value)} placeholder="122001" inputMode="numeric" maxLength={6} />
              </Field>
            </div>
          </div>}

          {/* Security */}
          {currentStep === 4 && <div className="grid gap-5">
            <Section icon={Lock} step="Step 4 of 4" title="Account security" subtitle="Set a strong account password" />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Password" error={errors.password}>
                <div className="relative">
                  <Input type={showPw ? "text" : "password"} value={fields.password} onChange={(e) => set("password", e.target.value)} placeholder="At least 8 characters" className="pr-10" />
                  <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink" aria-label="Toggle password visibility">
                    {showPw ? <VisibilityOff className="size-4" /> : <Visibility className="size-4" />}
                  </button>
                </div>
              </Field>
              <Field label="Confirm password" error={errors.confirmPassword}>
                <div className="relative">
                  <Input type={showConfirm ? "text" : "password"} value={fields.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} placeholder="Re-enter your password" className="pr-10" />
                  <button type="button" onClick={() => setShowConfirm((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink" aria-label="Toggle confirm password visibility">
                    {showConfirm ? <VisibilityOff className="size-4" /> : <Visibility className="size-4" />}
                  </button>
                </div>
              </Field>
            </div>
            {fields.password && (
              <div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className={`h-1.5 flex-1 ${i <= strength.score ? (strength.score <= 2 ? "bg-destructive" : strength.score <= 3 ? "bg-amber-500" : "bg-success") : "bg-muted"}`} />
                  ))}
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">Password strength: <strong className="text-ink">{strength.label}</strong> — use capital letters, numbers, and symbols for maximum security.</p>
              </div>
            )}
          </div>}

          {/* Terms + submit */}
          <div className="grid gap-4 border-t pt-6">
            {currentStep === 4 && <>
              <label className="flex items-start gap-3 text-sm text-muted-foreground">
                <Checkbox checked={terms} onCheckedChange={(v) => setTerms(v === true)} className="mt-0.5" />
                <span>
                  I accept the <span className="font-semibold text-primary">Terms of Service</span> and <span className="font-semibold text-primary">Retailer Policy</span>, and confirm that the provided business details are accurate.
                </span>
              </label>
              {errors.terms && <p className="text-xs font-medium text-destructive">{errors.terms}</p>}
            </>}
            <Button type="submit" size="lg" className="w-full">
              <VerifiedUser className="size-4" /> {currentStep === 4 ? "Create retailer account" : "Continue"}
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
              <LocationOn className="size-3.5" /> Send connection requests to wholesalers as soon as your account is created
            </p>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-primary hover:underline">
            <ArrowLeft className="size-4" /> Already have an account? Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
