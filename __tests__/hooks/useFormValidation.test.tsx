import { renderHook, act } from "@testing-library/react";
import { useFormValidation } from "@/hooks/useFormValidation";

interface TestFormData {
  name: string;
  email: string;
  age: number;
  password: string;
  tags: string[];
}

describe("useFormValidation", () => {
  const initialValues: TestFormData = {
    name: "",
    email: "",
    age: 0,
    password: "",
    tags: [],
  };

  const rules = {
    name: {
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    age: {
      required: true,
      min: 18,
      max: 100,
    },
    password: {
      required: true,
      minLength: 8,
    },
    tags: {
      required: true,
    },
  };

  it("should initialize with initial values", () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, rules),
    );

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.isValid).toBe(true);
  });

  it("should validate required fields", () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, rules),
    );

    act(() => {
      result.current.validate();
    });

    expect(result.current.errors.name).toBeDefined();
    expect(result.current.errors.email).toBeDefined();
    expect(result.current.errors.age).toBeDefined();
    expect(result.current.errors.password).toBeDefined();
    expect(result.current.errors.tags).toBeDefined();
    expect(result.current.isValid).toBe(false);
  });

  it("should validate minLength", () => {
    const minLengthRules = {
      name: {
        required: false,
        minLength: 3,
        maxLength: 50,
      },
    };

    const { result } = renderHook(() =>
      useFormValidation({ name: "" }, minLengthRules),
    );

    act(() => {
      result.current.setValue("name", "ab");
      result.current.validate();
    });

    expect(result.current.errors.name).toContain("al menos 3");
  });

  it("should validate maxLength", () => {
    const maxLengthRules = {
      name: {
        required: false,
        maxLength: 50,
      },
    };

    const { result } = renderHook(() =>
      useFormValidation({ name: "" }, maxLengthRules),
    );

    act(() => {
      result.current.setValue("name", "a".repeat(51));
    });

    act(() => {
      result.current.validate();
    });

    expect(result.current.errors.name).toBeDefined();
    expect(result.current.errors.name).toContain("máximo 50");
  });

  it("should validate pattern", () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, rules),
    );

    act(() => {
      result.current.setValue("email", "invalid-email");
      result.current.validate();
    });

    expect(result.current.errors.email).toBeDefined();
  });

  it("should validate min value", () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, rules),
    );

    act(() => {
      result.current.setValue("age", 17);
      result.current.validate();
    });

    expect(result.current.errors.age).toContain("mayor o igual a 18");
  });

  it("should validate max value", () => {
    const ageRules = {
      age: {
        required: false,
        min: 18,
        max: 100,
      },
    };

    const { result } = renderHook(() =>
      useFormValidation({ age: 25 }, ageRules),
    );

    act(() => {
      result.current.setValue("age", 101);
    });

    act(() => {
      result.current.validate();
    });

    expect(result.current.errors.age).toBeDefined();
    expect(result.current.errors.age).toContain("menor o igual a 100");
  });

  it("should validate array fields", () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, rules),
    );

    act(() => {
      result.current.setValue("tags", []);
      result.current.validate();
    });

    expect(result.current.errors.tags).toBeDefined();
  });

  it("should clear error when field is updated", () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, rules),
    );

    act(() => {
      result.current.setValue("name", "ab");
      result.current.validate();
    });

    expect(result.current.errors.name).toBeDefined();

    act(() => {
      result.current.setValue("name", "Valid Name");
    });

    expect(result.current.errors.name).toBeUndefined();
  });

  it("should validate with custom validator", () => {
    const customRules = {
      password: {
        required: false,
        custom: (value: string) => {
          if (!value || value.length < 8) {
            return "Password must be at least 8 characters";
          }
          if (!/[A-Z]/.test(value)) {
            return "Password must contain uppercase letter";
          }
          return null;
        },
      },
    };

    const { result } = renderHook(() =>
      useFormValidation({ password: "" }, customRules),
    );

    act(() => {
      result.current.setValue("password", "short");
      result.current.validate();
    });

    expect(result.current.errors.password).toContain("at least 8");

    act(() => {
      result.current.setValue("password", "longpassword");
    });

    act(() => {
      result.current.validate();
    });

    expect(result.current.errors.password).toContain("uppercase");

    act(() => {
      result.current.setValue("password", "LongPassword");
    });

    act(() => {
      result.current.validate();
    });

    expect(result.current.errors.password).toBeUndefined();
  });

  it("should reset form to initial values", () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, rules),
    );

    act(() => {
      result.current.setValue("name", "Test Name");
      result.current.setValue("email", "test@example.com");
    });

    expect(result.current.values.name).toBe("Test Name");

    act(() => {
      result.current.reset();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
  });

  it("should reset form to custom values", () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, rules),
    );

    const newValues: TestFormData = {
      name: "New Name",
      email: "new@example.com",
      age: 25,
      password: "password123",
      tags: ["tag1"],
    };

    act(() => {
      result.current.reset(newValues);
    });

    expect(result.current.values).toEqual(newValues);
  });

  it("should track touched fields", () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, rules),
    );

    act(() => {
      result.current.setFieldTouched("name");
    });

    expect(result.current.touched.name).toBe(true);
    expect(result.current.touched.email).toBeUndefined();
  });

  it("should return true for validate when all fields are valid", () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, rules),
    );

    act(() => {
      result.current.setValue("name", "Valid Name");
      result.current.setValue("email", "valid@example.com");
      result.current.setValue("age", 25);
      result.current.setValue("password", "password123");
      result.current.setValue("tags", ["tag1"]);
    });

    let isValid: boolean;
    act(() => {
      isValid = result.current.validate();
    });

    expect(isValid!).toBe(true);
    expect(result.current.isValid).toBe(true);
  });
});

