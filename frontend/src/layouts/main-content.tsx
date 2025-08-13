import * as React from "react";

type MainContentProps = {
  children: React.ReactNode;
};

export function MainContent({ children }: MainContentProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm container">
      {React.cloneElement(React.Children.only(children) as React.ReactElement)}
    </div>
  );
}
