import {
  ValidationProvider,
  ValidationObserver,
  extend,
  localize
} from "vee-validate";
import pl from "vee-validate/dist/locale/pl.json";
import * as Rules from "vee-validate/dist/rules";

for (var rule in Rules) {
  extend(rule, Rules[rule]);
}

localize("pl", pl);

export { ValidationProvider, ValidationObserver };
