using BL.Services;
using DTOs.Users;
using Resources.ValidationMessages;
using System.Text.RegularExpressions;
using Utils;

namespace API.Validators
{
    public class RegisterUserValidator: BaseValidator<RegisterUserDTO>, IValidate<RegisterUserDTO>
    {
        private readonly UserService UserService;

        public RegisterUserValidator(UserService userService) 
        {
            UserService = userService;

            ForProperty(p => p.Email)
                .Check(p => !String.IsNullOrEmpty(p.Email), UserValidationMessages.EmailRequired)
                .Check(p => p.Email.IsValidEmail(), UserValidationMessages.EmailNotValid)
                .Check(async p => !await UserService.EmailIsUsed(p.Email), UserValidationMessages.EmailAlreadyUsed);
            ForProperty(p => p.Password)
                .Check(p => !String.IsNullOrEmpty(p.Password), UserValidationMessages.PasswordRequired)
                .Check(p => Regex.IsMatch(p.Password, "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"), UserValidationMessages.PasswordNotValid);
        }
    }
    public class UpdateUserValidator : BaseValidator<UpdateUserDTO>, IValidate<UpdateUserDTO>
    {
        private readonly UserService UserService;

        public UpdateUserValidator(UserService userService)
        {
            UserService = userService;

            ForProperty(p => p.Email)
                .Check(p => !String.IsNullOrEmpty(p.Email), UserValidationMessages.EmailRequired)
                .Check(p => p.Email.IsValidEmail(), UserValidationMessages.EmailNotValid)
                .Check(async p => !await UserService.EmailIsUsed(p.Email), UserValidationMessages.EmailAlreadyUsed);
        }
    }
}
