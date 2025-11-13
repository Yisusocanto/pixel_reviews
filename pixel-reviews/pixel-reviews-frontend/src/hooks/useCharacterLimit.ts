import { useState, useEffect } from "react";

export const useCharacterLimit = (maxLengthValue: number, initialValue: string = "") => {
  const [characterCount, setCharacterCount] = useState<number>(initialValue.length);
  const [maxLength] = useState<number>(maxLengthValue);

  const handleChange = (stringValue: string) => {
    setCharacterCount(stringValue.length);
  };

  const reset = () => setCharacterCount(0);

  useEffect(() => {
    setCharacterCount(initialValue.length);
  }, [initialValue]);

  return { characterCount, maxLength, handleChange, reset };
};