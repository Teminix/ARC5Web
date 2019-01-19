const l = console.log;
function getFormData(form){
  let dict = {};
  for (let item of form.querySelectorAll('[name]')) {
    dict[item.name] = item.value
  }
  return dict
}
