import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {
  createContext,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type ReactNode,
} from "react";
import { ZxcvbnFactory } from "@zxcvbn-ts/core";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

const PasswordInputContext = createContext<{
  password: string;
} | null>(null);

export function PasswordInput({
  children,
  onChange,
  value,
  defaultValue,
  ...props
}: Omit<ComponentProps<typeof Input>, "type"> & {
  children?: ReactNode;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState(defaultValue ?? "");

  const Icon = showPassword ? EyeOffIcon : EyeIcon;
  const currentValue = value ?? password;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    onChange?.(e);
  };

  return (
    <PasswordInputContext value={{ password: currentValue.toString() }}>
      <div className="space-y-3">
        <InputGroup>
          <InputGroupInput
            {...props}
            value={value}
            defaultValue={defaultValue}
            type={showPassword ? "text" : "password"}
            onChange={handleChange}
          />

          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="button"
              size="icon-xs"
              onClick={() => setShowPassword((p) => !p)}
            >
              <Icon className="size-4.5" />

              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        {children}
      </div>
    </PasswordInputContext>
  );
}

export function PasswordInputStrengthChecker() {
  const [optionsLoaded, setOptionsLoaded] = useState(false);
  const [errorLoadingOptions, setErrorLoadingOptions] = useState(false);
  const [zxcvbn, setZxcvbn] = useState<ZxcvbnFactory | null>(null);

  const { password } = usePasswordInput();
  const deferredPassword = useDeferredValue(password);

  useEffect(() => {
    Promise.all([
      import("@zxcvbn-ts/language-common"),
      import("@zxcvbn-ts/language-en"),
    ])
      .then(([common, english]) => {
        const instance = new ZxcvbnFactory({
          translations: english.translations,
          graphs: common.adjacencyGraphs,
          maxLength: 50,
          dictionary: {
            ...common.dictionary,
            ...english.dictionary,
          },
        });

        setZxcvbn(instance);
        setOptionsLoaded(true);
      })
      .catch(() => {
        setErrorLoadingOptions(true);
      });
  }, []);

  const strengthResult = useMemo(() => {
    if (!zxcvbn || !optionsLoaded || deferredPassword.length === 0) {
      return null;
    }

    return zxcvbn.check(deferredPassword);
  }, [zxcvbn, optionsLoaded, deferredPassword]);

  function getLabel() {
    if (deferredPassword.length === 0) {
      return "Password strength";
    }

    if (!optionsLoaded) {
      return "Loading strength checker";
    }

    if (!strengthResult) {
      return "Password strength";
    }

    switch (strengthResult.score) {
      case 0:
      case 1:
        return "Very weak";

      case 2:
        return "Weak";

      case 3:
        return "Strong";

      case 4:
        return "Very strong";

      default:
        return "Unknown";
    }
  }

  if (errorLoadingOptions) {
    return null;
  }

  const label = getLabel();
  const score = strengthResult?.score ?? 0;
  const warning = strengthResult?.feedback.warning;

  return (
    <div className="space-y-0.5">
      <div
        role="progressbar"
        aria-label="Password Strength"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuetext={label}
        className="flex gap-1"
      >
        {Array.from({ length: 4 }).map((_, i) => {
          const color =
            score >= 3 ? "bg-primary" : "bg-destructive";

          return (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full",
                score > i ? color : "bg-secondary",
              )}
            />
          );
        })}
      </div>

      <div className="flex justify-end text-sm text-muted-foreground">
        {warning == null ? (
          label
        ) : (
          <Tooltip>
            <TooltipTrigger className="underline underline-offset-1">
              {label}
            </TooltipTrigger>

            <TooltipContent
              side="bottom"
              sideOffset={4}
              className="text-base"
            >
              {warning}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

function usePasswordInput() {
  const context = useContext(PasswordInputContext);

  if (context == null) {
    throw new Error(
      "usePasswordInput must be used within a PasswordInput",
    );
  }

  return context;
}