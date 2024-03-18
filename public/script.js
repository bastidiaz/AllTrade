function sendToMail(){
    var params = {
        lastName: document.getElementById("inputLastName").value ,
        firstName: document.getElementById("inputFirstName").value ,
        companyName: document.getElementById("companyName").value ,
        email: document.getElementById("inputEmail4").value ,
        phoneNumber: document.getElementById("inputNumber").value ,
        message: document.getElementById("inputMessage").value ,
    };

    const serviceID = "service_7wmnjwq";
    const templateID = "template_q8rohka";
    EmailJSResponseStatus.send(serviceID,templateID,params)
.then(
    res =>{
        document.getElementById("inputLastName").value = "",
        document.getElementById("inputFirstName").value = "",
        document.getElementById("companyName").value = "",
        document.getElementById("inputEmail4").value = "",
        document.getElementById("inputNumber").value = "",
        document.getElementById("inputMessage").value = 0,
        console.log(res);
        alert("Your Inquiry is sent! thank you.");
    }
).catch((error) => console.log(error));
}
