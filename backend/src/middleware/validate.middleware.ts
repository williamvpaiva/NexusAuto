import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError, ZodEffects } from 'zod';

type ValidationSchema = AnyZodObject | ZodEffects<AnyZodObject>;

export interface RequestValidation {
  body?: ValidationSchema;
  query?: ValidationSchema;
  params?: ValidationSchema;
}

export const validate = (schemas: RequestValidation | ValidationSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Se for passado apenas um schema (compatibilidade com versão anterior)
      if (schemas instanceof ZodEffects || ('shape' in schemas && typeof schemas.shape === 'object')) {
        await (schemas as ValidationSchema).parseAsync(req.body);
        return next();
      }

      // Validação múltipla (body, query, params)
      const validations = schemas as RequestValidation;
      
      if (validations.body) {
        req.body = await validations.body.parseAsync(req.body);
      }
      if (validations.query) {
        req.query = await validations.query.parseAsync(req.query);
      }
      if (validations.params) {
        req.params = await validations.params.parseAsync(req.params);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          code: err.code,
          message: err.message
        }));

        return res.status(422).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Erro de validação dos dados de entrada',
            details: formattedErrors,
            requestId: req.requestId
          }
        });
      }
      next(error);
    }
  };
};
