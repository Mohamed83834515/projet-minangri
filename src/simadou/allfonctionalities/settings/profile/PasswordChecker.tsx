import { Check, Dot } from "lucide-react";
import React from "react";

type PasswordCheckerProps = {
  password: string;
};

const rules = [
  {
    label: "8 charactères",
    test: (pw: string) => pw.length >= 8,
  },
  {
    label: "Une lettre minuscule",
    test: (pw: string) => /[a-z]/.test(pw),
  },
  {
    label: "Une lettre majuscule",
    test: (pw: string) => /[A-Z]/.test(pw),
  },
  {
    label: "Un chiffre",
    test: (pw: string) => /\d/.test(pw),
  },
  {
    label: "Un caractère spécial",
    test: (pw: string) => /[^A-Za-z0-9]/.test(pw),
  },
];

const PasswordChecker: React.FC<PasswordCheckerProps> = ({ password }) => {
  return (
    <section className="mt-2 flex flex-col space-y-1 text-sm border pl-3 rounded-md py-4 bg-primary/10">
      <span className="mb-3">Votre mot de passe doit contenir au moins :</span>
      {rules.map((rule) => {
        const isValid = rule.test(password);

        return (
          <div
            key={rule.label}
            className={`flex items-center gap-2 ${
              isValid ? "text-green-800 font-semibold" : "text-gray-500"
            }`}
          >
            <span>{isValid 
            ? <Check  color="green"/>
            : <Dot textDecoration={'muted/50'}/>
            }</span>
            <span>{rule.label}</span>
          </div>
        );
      })}
    </section>
  );
};

export default PasswordChecker;
