﻿using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using TeamBuilder.ViewModels;

namespace TeamBuilder.Controllers
{
	//For swagger swachbuckle only
	//[ApiExplorerSettings(IgnoreApi = true)]
	//https://stackoverflow.com/a/38935583/9744434
	public class ErrorsController : Controller
	{
		[Route("api/error")]
		public ErrorResponseViewModel Error()
		{
			var context = HttpContext.Features.Get<IExceptionHandlerFeature>();
			var exception = context?.Error;
			var responseException = new ErrorResponseViewModel(exception);

			//TODO Костыль. Код 204 не возвращает json => мы будем валиться на попытке получить тело ответа. Переделать по умному)
			Response.StatusCode = responseException.IsNoContent ? 403 : (int)responseException.Code;

			return responseException;
		}
	}
}
