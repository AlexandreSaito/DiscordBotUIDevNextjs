function arrayIsEqual(array1, array2) {
  return false;
}

function assignDeleteProperty(name, newObj, current, changes) {
  //console.log(name, newObj[name], current[name]);
  if (typeof current[name] != "object") {
    changes.max++;
    if (newObj[name] == current[name]) {
      changes.without++;
      return;
    }
    newObj[name] = current[name];
  }
  if (typeof current[name] == "object") {
    if (Array.isArray(current[name])) {
      changes.max++;
      if (arrayIsEqual(current[name], newObj[name])) {
        changes.without++;
        return;
      }
      newObj[name] = current[name].map((x) => x);
    } else if (!newObj[name]) {
      changes.max++;
      newObj[name] = Object.assign({}, current[name]);
    } else if (!current[name]) {
      changes.max++;
      newObj[name] = current[name];
    } else {
      var names = Object.getOwnPropertyNames(current[name]);
      for (let i = 0; i < names.length; i++) {
        assignDeleteProperty(names[i], newObj[name], current[name], changes);
      }
    }
  }

  delete current[name];
}

export function copyChangeObject(toCopy, changes) {
  var change = {
    max: 0,
    without: 0,
    shouldUpdate: function () {
      return this.max != this.without;
    },
  };
  //let b = Object.assign({}, changes);
  //console.log(b);
  let newState = Object.assign({}, toCopy);
  var names = Object.getOwnPropertyNames(changes);
  for (let i = 0; i < names.length; i++) {
    assignDeleteProperty(names[i], newState, changes, change);
  }
  //console.log("withoutChanges", change);
  if (!change.shouldUpdate()) return false;
  Object.assign(newState, changes);
  return newState;
}

export function changeState(setState, oldO, newO) {
  let o = copyChangeObject(oldO, newO);
  if (o != false) setState(o);
}
