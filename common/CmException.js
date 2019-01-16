export default function CmException(name, message, action) {
  this.message = message;
  this.name = name;
  this.action = action;
}
