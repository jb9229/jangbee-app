export default function CmException(name, message, action) {
  if (name === undefined || name === null || name === '') {
    this.name = 'Unexpected';
  } else {
    this.name = name;
  }
  if (message === undefined || message === null || message === '') {
    this.message = 'none';
  } else {
    this.message = message;
  }
  if (action === undefined || action === null || action === '') {
    this.action = 'none';
  } else {
    this.action = action;
  }
}
