export const emailValidation = (email) => {
    console.log('In emailValidation');
    console.log('email:', email);
    const re = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    return re.test(email);    
}
