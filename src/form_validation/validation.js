export const validation = (data) => {
  const errors = {};
  if (data.password && data.confirm_pass) {
    if (data.password !== data.confirm_pass) {
      errors.confirm_pass = "Passwords don't match";
    }
    if (!/^[A-z0-9.!?,+]{6,}$/i.test(data.password)) {
      errors.confirm_pass =
        "Password should be at least 6 characters. Allowed characters: A-z 0-9 . , ! ? +";
    }
  }
  Object.entries(data).forEach(([key, value]) => {
    if (key === "username") {
      if (!/^[a-z0-9._]{0,}$/.test(value)) {
        errors.username = "Allowed characters: a-z 0-9 . _";
      }
    }

    if (key === "password") {
      if (!value) {
        errors.password = "Please enter your password";
      }
    }
    if (key === "confirm_pass") {
      if (!value) {
        errors.confirm_pass = "Passwords don't match";
      }
    }
    if (key === "login") {
      if (!value) {
        errors.login = "Please enter your username or email";
      }
    }
    if (key === "email") {
      if (!value) {
        errors.email = "Enter your email";
      } else if (!/^[A-Z0-9.,_%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
        errors.email = "Invalid email address";
      }
    }
    if (key === "first_name") {
      if (!value) {
        errors.first_name = "Please enter you name";
      }
    }
    if (key === "lat") {
      if (!value) {
        errors.address = "Please enter location";
      }
    }
    if (key === "body") {
      if (!value) {
        errors.body = "Please enter something";
      }
    }
    if (key === "search_term") {
      if (!value) {
        errors.search_term = "Please enter location";
      } else if (value.length < 2) {
        errors.search_term = "Your location is too short";
      }
    }
    if (key === "profile_addr") {
      if (!value) {
        errors.profile_addr = "Field cannot be empty";
      }
    }
    if (key === "name") {
      if (!value) {
        errors.name = "Please enter name";
      }
      if (value.length > 12) {
        errors.name = "Should not be more then 12 letters";
      }
    }
    if (key === "product_type") {
      if (!value) {
        errors.product_type = "Please select product type";
      }
    }
    if (key === "description") {
      if (!value) {
        errors.description = "Please describe your product";
      }
      if (value.length > 2000) {
        errors.name = "Should not be more then 2000 letters";
      }
    }
    if (key === "url") {
      if (!value) {
        errors.url = "Please enter image url";
      }
    }
    if (key === "location") {
      if (!value || value === "add") {
        errors.location = "Please choose or add location";
      }
    }
    if (key === "product_icon") {
      if (!value) {
        errors.product_icon = "Please choose an icon";
      }
    }
    // if (key === "range") {
    //   if (!value || value === 0) {
    //     errors.range = "Please enter range";
    //   }
    //   if (value > 3000) {
    //     errors.range = "Range should be less then 300";
    //   }
    //   if (value < 0) {
    //     errors.range = "Range should be positive number";
    //   }
    // }
  });

  return errors;
};
