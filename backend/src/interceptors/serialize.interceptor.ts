import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // Run something before request is coming
        // console.log('Before handling it: ', context)

        return next.handle().pipe(
            map((data) => {
                // Run something before response is send out
                return {
                    data: {
                        ...data,
                    },
                }
            })
        )
    }
}
