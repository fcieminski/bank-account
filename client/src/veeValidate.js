import {
  ValidationProvider,
  ValidationObserver,
  extend,
  localize
} from "vee-validate";
import pl from "vee-validate/dist/locale/pl.json";
import * as rules from "vee-validate/dist/rules";

Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule]);
});

localize("pl", pl);

export { ValidationProvider, ValidationObserver };
