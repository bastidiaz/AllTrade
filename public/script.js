function sendToMail(){
    var params = {
        firstName: document.getElementById("inputFirstName").value,
        lastName: document.getElementById("inputLastName").value,
        companyName: document.getElementById("inputCompanyName").value,
        email: document.getElementById("inputEmail").value,
        phoneNumber: document.getElementById("inputNumber").value,
        message: document.getElementById("inputMessage").value,
    };

    const serviceID = "service_7wmnjwq";
    const templateID = "template_q8rohka";
    EmailJSResponseStatus.send(serviceID,templateID,params)
.then(
    res =>{
        document.getElementById("inputFirstName").value = "",
        document.getElementById("inputLastName").value = "",
        document.getElementById("inputCompanyName").value = "",
        document.getElementById("inputEmail").value = "",
        document.getElementById("inputNumber").value = "",
        document.getElementById("inputMessage").value = 0,
        console.log(res);

        alert("Your Inquiry is sent! thank you.");
    }
).catch((error) => console.log(error));
}
