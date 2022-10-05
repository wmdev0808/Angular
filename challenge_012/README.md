# Communicating with backend services using HTTP

- Most front-end applications need to communicate with a server over the HTTP protocol, to download or upload data and access other back-end services. Angular provides a client HTTP API for Angular applications, the `HttpClient` service class in `@angular/common/http`.

- The HTTP client service offers the following major features.
  - The ability to request typed response objects
  - Streamlined error handling
  - Testability features
  - Request and response interception

## Setup for server communication

- Before you can use HttpClient, you need to import the Angular `HttpClientModule`.

  - app/app.module.ts (excerpt)

    ```
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { HttpClientModule } from '@angular/common/http';

    @NgModule({
      imports: [
        BrowserModule,
        // import HttpClientModule after BrowserModule.
        HttpClientModule,
      ],
      declarations: [
        AppComponent,
      ],
      bootstrap: [ AppComponent ]
    })
    export class AppModule {}
    ```

- You can then inject the `HttpClient` service as a dependency of an application class, as shown in the following ConfigService example.

  - app/config/config.service.ts (excerpt)

    ```
    import { Injectable } from '@angular/core';
    import { HttpClient } from '@angular/common/http';

    @Injectable()
    export class ConfigService {
      constructor(private http: HttpClient) { }
    }
    ```

- The `HttpClient` service makes use of `observables` for all transactions. You must import the RxJS observable and operator symbols that appear in the example snippets. These ConfigService imports are typical.

  - app/config/config.service.ts (RxJS imports)

    ```
    import { Observable, throwError } from 'rxjs';
    import { catchError, retry } from 'rxjs/operators';
    ```

## Requesting data from a server

- Use the `HttpClient.get()` method to fetch data from a server. The asynchronous method sends an HTTP request, and returns an Observable that emits the requested data when the response is received. The return type varies based on the `observe` and `responseType` values that you pass to the call.

- The `get()` method takes two arguments; the endpoint URL from which to fetch, and an options object that is used to configure the request.

  ```
  options: {
    headers?: HttpHeaders | {[header: string]: string | string[]},
    observe?: 'body' | 'events' | 'response',
    params?: HttpParams|{[param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>},
    reportProgress?: boolean,
    responseType?: 'arraybuffer'|'blob'|'json'|'text',
    withCredentials?: boolean,
  }
  ```

  - The _observe_ option specifies how much of the response to return
  - The _responseType_ option specifies the format in which to return data

  - Usage notes:

    - Use the options object to configure various other aspects of an outgoing request. In Adding headers, for example, the service set the default headers using the headers option property.

    - Use the params property to configure a request with HTTP URL parameters, and the reportProgress option to listen for progress events when transferring large amounts of data.

    - assets/config.json

      ```
      {
        "heroesUrl": "api/heroes",
        "textfile": "assets/textfile.txt",
        "date": "2020-01-29"
      }
      ```

    - To fetch this kind of data, the get() call needs the following options: {observe: 'body', responseType: 'json'}. These are the default values for those options, so the following examples do not pass the options object.

      - app/config/config.service.ts (getConfig v.1)

        ```
        configUrl = 'assets/config.json';

        getConfig() {
          return this.http.get<Config>(this.configUrl);
        }
        ```

      - app/config/config.component.ts (showConfig v.1)
        ```
        showConfig() {
          this.configService.getConfig()
            .subscribe((data: Config) => this.config = {
                heroesUrl: data.heroesUrl,
                textfile:  data.textfile,
                date: data.date,
            });
        }
        ```

### Starting the request

- For all HttpClient methods, the method doesn't begin its HTTP request until you call subscribe() on the observable the method returns.

- You should always unsubscribe from an observable when a component is destroyed.

- All observables returned from HttpClient methods are cold by design. Execution of the HTTP request is deferred, letting you extend the observable with additional operations such as tap and catchError before anything actually happens.

- Calling subscribe() triggers execution of the observable and causes HttpClient to compose and send the HTTP request to the server.

  - In fact, each subscribe() initiates a separate, independent execution of the observable. Subscribing twice results in two HTTP requests.

    ```
    const req = http.get<Heroes>('/api/heroes');
    // 0 requests made - .subscribe() not called.
    req.subscribe();
    // 1 request made.
    req.subscribe();
    // 2 requests made.
    ```

### Requesting a typed response

- Structure your HttpClient request to declare the type of the response object, to make consuming the output easier and more obvious. Specifying the response type acts as a type assertion at compile time.

  - Specifying the response type is a declaration to TypeScript that it should treat your response as being of the given type. This is a build-time check and doesn't guarantee that the server actually responds with an object of this type. It is up to the server to ensure that the type specified by the server API is returned.

- To specify the response object type, first define an interface with the required properties. Use an interface rather than a class, because the response is a plain object that cannot be automatically converted to an instance of a class.

  ```
  export interface Config {
    heroesUrl: string;
    textfile: string;
    date: any;
  }
  ```

- Next, specify that interface as the HttpClient.get() call's type parameter in the service.

  - app/config/config.service.ts (getConfig v.2)

    ```
    getConfig() {
      // now returns an Observable of Config
      return this.http.get<Config>(this.configUrl);
    }
    ```

  - When you pass an interface as a type parameter to the HttpClient.get() method, use the RxJS map operator to transform the response data as needed by the UI. You can then pass the transformed data to the async pipe.

  - The callback in the updated component method receives a typed data object, which is easier and safer to consume:

    - app/config/config.component.ts (showConfig v.2)

      ```
      config: Config | undefined;

      showConfig() {
        this.configService.getConfig()
          // clone the data object, using its known Config shape
          .subscribe((data: Config) => this.config = { ...data });
      }
      ```

  - To access properties that are defined in an interface, you must explicitly convert the plain object you get from the JSON to the required response type. For example, the following subscribe callback receives data as an Object, and then type-casts it in order to access the properties.

    ```
    .subscribe(data => this.config = {
      heroesUrl: (data as any).heroesUrl,
      textfile:  (data as any).textfile,
    });
    ```

  - OBSERVE AND RESPONSE TYPES

    - The types of the observe and response options are string unions, rather than plain strings.

      ```
      options: {
        …
        observe?: 'body' | 'events' | 'response',
        …
        responseType?: 'arraybuffer'|'blob'|'json'|'text',
        …
      }
      ```

    - This can cause confusion. For example:

      ```
      // this works
      client.get('/foo', {responseType: 'text'})

      // but this does NOT work
      const options = {
        responseType: 'text',
      };
      client.get('/foo', options)
      ```

      - In the second case, TypeScript infers the type of options to be {responseType: string}. The type is too wide to pass to HttpClient.get which is expecting the type of responseType to be one of the specific strings. HttpClient is typed explicitly this way so that the compiler can report the correct return type based on the options you provided.

    - Use as const to let TypeScript know that you really do mean to use a constant string type:
      ```
      const options = {
        responseType: 'text' as const,
      };
      client.get('/foo', options);
      ```

### Reading the full response

- In the previous example, the call to HttpClient.get() did not specify any options. By default, it returned the JSON data contained in the response body.

- Tell `HttpClient` that you want the full response with the `observe` option of the `get()` method:

  ```
  getConfigResponse(): Observable<HttpResponse<Config>> {
    return this.http.get<Config>(
      this.configUrl, { observe: 'response' });
  }
  ```

  - Now HttpClient.get() returns an Observable of type HttpResponse rather than just the JSON data contained in the body.

- The component's showConfigResponse() method displays the response headers as well as the configuration:

  - app/config/config.component.ts (showConfigResponse)

    ```
    showConfigResponse() {
      this.configService.getConfigResponse()
        // resp is of type `HttpResponse<Config>`
        .subscribe(resp => {
          // display its headers
          const keys = resp.headers.keys();
          this.headers = keys.map(key =>
            `${key}: ${resp.headers.get(key)}`);

          // access the body directly, which is typed as `Config`.
          this.config = { ...resp.body! };
        });
    }
    ```

### Making a JSONP request

- Apps can use the `HttpClient` to make `JSONP` requests across domains when a server doesn't support CORS protocol

- In Angular, use JSONP by including `HttpClientJsonpModule` in the `NgModule` imports. In the following example, the `searchHeroes()` method uses a JSONP request to query for heroes whose names contain the search term.

  ```
  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable {
    term = term.trim();

    const heroesURL = `${this.heroesURL}?${term}`;
    return this.http.jsonp(heroesUrl, 'callback').pipe(
        catchError(this.handleError('searchHeroes', [])) // then handle the error
      );
  }
  ```

  - This request passes the heroesURL as the first parameter and the callback function name as the second parameter. The response is wrapped in the callback function, which takes the observables returned by the JSONP method and pipes them through to the error handler.

### Requesting non-JSON data

- Not all APIs return JSON data. In this next example, a DownloaderService method reads a text file from the server and logs the file contents, before returning those contents to the caller as an `Observable<string>`.

  - app/downloader/downloader.service.ts (getTextFile)

    ```
    getTextFile(filename: string) {
      // The Observable returned by get() is of type Observable<string>
      // because a text response was specified.
      // There's no need to pass a <string> type parameter to get().
      return this.http.get(filename, {responseType: 'text'})
        .pipe(
          tap( // Log the result or error
          {
            next: (data) => this.log(filename, data),
            error: (error) => this.logError(filename, error)
          }
          )
        );
    }
    ```

    - The RxJS tap operator lets the code inspect both success and error values passing through the observable without disturbing them.

  - A download() method in the DownloaderComponent initiates the request by subscribing to the service method.

    ```
    download() {
      this.downloaderService.getTextFile('assets/textfile.txt')
        .subscribe(results => this.contents = results);
    }
    ```

## Handling request errors

- If the request fails on the server, `HttpClient` returns an error object instead of a successful response.

### Getting error details

- Two types of errors can occur.

  - The server backend might reject the request, returning an HTTP response with a status code such as 404 or 500. These are error responses.

  - Something could go wrong on the client-side such as a network error that prevents the request from completing successfully or an exception thrown in an RxJS operator. These errors have `status` set to `0` and the `error` property contains a `ProgressEvent` object, whose `type` might provide further information.

- `HttpClient` captures both kinds of errors in its `HttpErrorResponse`. Inspect that response to identify the error's cause.

  - app/config/config.service.ts (handleError)

    ```
    private handleError(error: HttpErrorResponse) {
      if (error.status === 0) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong.
        console.error(
          `Backend returned code ${error.status}, body was: `, error.error);
      }
      // Return an observable with a user-facing error message.
      return throwError(() => new Error('Something bad happened; please try again later.'));
    }
    ```

    - The handler returns an RxJS ErrorObservable with a user-friendly error message.

  - app/config/config.service.ts (getConfig v.3 with error handler)
    ```
    getConfig() {
      return this.http.get<Config>(this.configUrl)
        .pipe(
          catchError(this.handleError)
        );
    }
    ```

### Retrying a failed request

- Sometimes the error is transient and goes away automatically if you try again. For example, network interruptions are common in mobile scenarios, and trying again can produce a successful result.

- The RxJS library offers several _retry_ operators. For example, the `retry()` operator automatically re-subscribes to a failed Observable a specified number of times. Re-subscribing to the result of an `HttpClient` method call has the effect of reissuing the HTTP request.

- app/config/config.service.ts (getConfig with retry)
  ```
  getConfig() {
    return this.http.get<Config>(this.configUrl)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }
  ```

## Sending data to a server

- In addition to fetching data from a server, `HttpClient` supports other HTTP methods such as PUT, POST, and DELETE, which you can use to modify the remote data.

### Making a POST request

- app/heroes/heroes.service.ts (addHero)

  ```
  /** POST: add a new hero to the database */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions)
      .pipe(
        catchError(this.handleError('addHero', hero))
      );
  }
  ```

- app/heroes/heroes.component.ts (addHero)
  ```
  this.heroesService
    .addHero(newHero)
    .subscribe(hero => this.heroes.push(hero));
  ```

### Making a DELETE request

- app/heroes/heroes.service.ts (deleteHero)

  ```
  /** DELETE: delete the hero from the server */
  deleteHero(id: number): Observable<unknown> {
    const url = `${this.heroesUrl}/${id}`; // DELETE api/heroes/42
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError('deleteHero'))
      );
  }
  ```

- app/heroes/heroes.component.ts (deleteHero)

  ```
  this.heroesService
    .deleteHero(hero.id)
    .subscribe();
  ```

  - The component isn't expecting a result from the delete operation, so it subscribes without a callback. Even though you are not using the result, you still have to subscribe. Calling the subscribe() method executes the observable, which is what initiates the DELETE request.

  - NOTE: You must call subscribe() or nothing happens. Just calling HeroesService.deleteHero() does not initiate the DELETE request.

    ```
    // oops ... subscribe() is missing so nothing happens
    this.heroesService.deleteHero(hero.id);
    ```

### Making a PUT request

- app/heroes/heroes.service.ts (updateHero)
  ```
  /** PUT: update the hero on the server. Returns the updated hero upon success. */
  updateHero(hero: Hero): Observable<Hero> {
    return this.http.put<Hero>(this.heroesUrl, hero, httpOptions)
      .pipe(
        catchError(this.handleError('updateHero', hero))
      );
  }
  ```

### Adding and updating headers

- Many servers require extra headers for save operations. For example, a server might require an authorization token, or "Content-Type" header to explicitly declare the MIME type of the request body.

#### Adding headers

- app/heroes/heroes.service.ts (httpOptions)

  ```
  import { HttpHeaders } from '@angular/common/http';

  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: 'my-auth-token'
    })
  };
  ```

#### Updating headers

- You can't directly modify the existing headers within the previous options object because instances of the HttpHeaders class are immutable. Use the set() method instead, to return a clone of the current instance with the new changes applied.

  ```
  httpOptions.headers =
    httpOptions.headers.set('Authorization', 'my-new-auth-token');
  ```

## Configuring HTTP URL parameters

- Use the `HttpParams` class with the `params` request option to add URL query strings in your `HttpRequest`.

  ```
  import {HttpParams} from "@angular/common/http";
  ```

  ```
  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    term = term.trim();

    // Add safe, URL encoded search parameter if there is a search term
    const options = term ?
    { params: new HttpParams().set('name', term) } : {};

    return this.http.get<Hero[]>(this.heroesUrl, options)
      .pipe(
        catchError(this.handleError<Hero[]>('searchHeroes', []))
      );
  }
  ```

  - If there is a search term, the code constructs an options object with an HTML URL-encoded search parameter. If the term is "cat", for example, the GET request URL would be api/heroes?name=cat.

- The `HttpParams` object is immutable. If you need to update the options, save the returned value of the `.set()` method.

- You can also create HTTP parameters directly from a query string by using the `fromString` variable:
  ```
  const params = new HttpParams({fromString: 'name=foo'});
  ```

## Intercepting requests and responses

- With interception, you declare interceptors that inspect and transform HTTP requests from your application to a server. The same interceptors can also inspect and transform a server's responses on their way back to the application. Multiple interceptors form a forward-and-backward chain of request/response handlers.

- Interceptors can perform a variety of implicit tasks, from authentication to logging, in a routine, standard way, for every HTTP request/response.

- Without interception, developers would have to implement these tasks explicitly for each `HttpClient` method call.

### Write an interceptor

- To implement an interceptor, declare a class that implements the `intercept()` method of the `HttpInterceptor` interface.

- Here is a do-nothing noop interceptor that passes the request through without touching it:

  - app/http-interceptors/noop-interceptor.ts

    ```
    import { Injectable } from '@angular/core';
    import {
      HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
    } from '@angular/common/http';

    import { Observable } from 'rxjs';

    /** Pass untouched request through to the next request handler. */
    @Injectable()
    export class NoopInterceptor implements HttpInterceptor {

      intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {
        return next.handle(req);
      }
    }
    ```

### The next object

- The next object represents the next interceptor in the chain of interceptors. The final next in the chain is the `HttpClient` backend handler that sends the request to the server and receives the server's response.

- An interceptor _could_ skip calling next.handle(), short-circuit the chain, and return its own Observable with an artificial server response.

### Provide the interceptor

- The `NoopInterceptor` is a service managed by Angular's `dependency injection (DI)` system. Like other services, you must provide the interceptor class before the app can use it.

- After importing the `HTTP_INTERCEPTORS` injection token from @angular/common/http, write the `NoopInterceptor` provider like this:
  ```
  { provide: HTTP_INTERCEPTORS, useClass: NoopInterceptor, multi: true },
  ```

### Interceptor order

- Angular applies interceptors in the order that you provide them. For example, consider a situation in which you want to handle the authentication of your HTTP requests and log them before sending them to a server. To accomplish this task, you could provide an `AuthInterceptor` service and then a `LoggingInterceptor` service. Outgoing requests would flow from the `AuthInterceptor` to the `LoggingInterceptor`. Responses from these requests would flow in the other direction, from `LoggingInterceptor` back to `AuthInterceptor`.

- The following is a visual representation of the process:
  ![](https://angular.io/generated/images/guide/http/interceptor-order.svg)

- The last interceptor in the process is always the `HttpBackend` that handles communication with the server.

- You cannot change the order or remove interceptors later. If you need to enable and disable an interceptor dynamically, you'll have to build that capability into the interceptor itself.

### Handling interceptor events

- Most `HttpClient` methods return observables of `HttpResponse<any>`. The HttpResponse class itself is actually an event, whose type is `HttpEventType.Response`. A single HTTP request can, however, generate multiple events of other types, including upload and download progress events.

- Your interceptor should return every event without modification unless it has a compelling reason to do otherwise.

  - TypeScript prevents you from setting HttpRequest read-only properties.
    ```
    // Typescript disallows the following assignment because req.url is readonly
    req.url = req.url.replace('http://', 'https://');
    ```

- If you must alter a request, clone it first and modify the clone before passing it to next.handle(). You can clone and modify the request in a single step, as shown in the following example.

  ```
  // clone request and replace 'http://' with 'https://' at the same time
  const secureReq = req.clone({
    url: req.url.replace('http://', 'https://')
  });
  // send the cloned, "secure" request to the next handler.
  return next.handle(secureReq);
  ```

  - The `clone()` method's hash argument lets you mutate specific properties of the request while copying the others.

#### Modifying a request body

- The readonly assignment guard can't prevent deep updates and, in particular, it can't prevent you from modifying a property of a request body object.

  ```
  req.body.name = req.body.name.trim(); // bad idea!
  ```

- If you must modify the request body, follow these steps.

  1. Copy the body and make your change in the copy.
  2. Clone the request object, using its clone() method.
  3. Replace the clone's body with the modified copy.

  - app/http-interceptors/trim-name-interceptor.ts (excerpt)
    ```
    // copy the body and trim whitespace from the name property
    const newBody = { ...body, name: body.name.trim() };
    // clone request and set its body
    const newReq = req.clone({ body: newBody });
    // send the cloned request to the next handler.
    return next.handle(newReq);
    ```

#### Clearing the request body in a clone

- Sometimes you need to clear the request body rather than replace it. To do this, set the cloned request body to `null`.

- Tip:

  - If you set the cloned request body to `undefined`, Angular assumes you intend to leave the body as is.

  ```
  newReq = req.clone({ … }); // body not mentioned => preserve original body
  newReq = req.clone({ body: undefined }); // preserve original body
  newReq = req.clone({ body: null }); // clear the body
  ```

## Http interceptor use-cases

### Setting default headers

- app/http-interceptors/auth-interceptor.ts

  ```
  import { AuthService } from '../auth.service';

  @Injectable()
  export class AuthInterceptor implements HttpInterceptor {

    constructor(private auth: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
      // Get the auth token from the service.
      const authToken = this.auth.getAuthorizationToken();

      // Clone the request and replace the original headers with
      // cloned headers, updated with the authorization.
      const authReq = req.clone({
        headers: req.headers.set('Authorization', authToken)
      });

      // send cloned request with header to the next handler.
      return next.handle(authReq);
    }
  }
  ```

- The practice of cloning a request to set new headers is so common that there's a setHeaders shortcut for it:

  ```
  // Clone the request and set the new header in one step.
  const authReq = req.clone({ setHeaders: { Authorization: authToken } });
  ```

- An interceptor that alters headers can be used for a number of different operations, including:
  - Authentication/authorization
  - Caching behavior; for example, If-Modified-Since
  - XSRF protection

### Logging request and response pairs

- Because interceptors can process the request and response together, they can perform tasks such as timing and logging an entire HTTP operation.

- app/http-interceptors/logging-interceptor.ts)

  ```
  import { finalize, tap } from 'rxjs/operators';
  import { MessageService } from '../message.service';

  @Injectable()
  export class LoggingInterceptor implements HttpInterceptor {
    constructor(private messenger: MessageService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
      const started = Date.now();
      let ok: string;

      // extend server response observable with logging
      return next.handle(req)
        .pipe(
          tap({
            // Succeeds when there is a response; ignore other events
            next: (event) => (ok = event instanceof HttpResponse ? 'succeeded' : ''),
            // Operation failed; error is an HttpErrorResponse
            error: (error) => (ok = 'failed')
          }),
          // Log when response observable either completes or errors
          finalize(() => {
            const elapsed = Date.now() - started;
            const msg = `${req.method} "${req.urlWithParams}"
              ${ok} in ${elapsed} ms.`;
            this.messenger.add(msg);
          })
        );
    }
  }
  ```

  - The RxJS `tap` operator captures whether the request succeeded or failed. The RxJS `finalize` operator is called when the response observable either returns an error or completes and reports the outcome to the MessageService.

  - Neither tap nor finalize touch the values of the observable stream returned to the caller.

### Custom JSON parsing

- Interceptors can be used to replace the built-in JSON parsing with a custom implementation.

- app/http-interceptors/custom-json-interceptor.ts

  ```
  // The JsonParser class acts as a base class for custom parsers and as the DI token.
  @Injectable()
  export abstract class JsonParser {
    abstract parse(text: string): any;
  }

  @Injectable()
  export class CustomJsonInterceptor implements HttpInterceptor {
    constructor(private jsonParser: JsonParser) {}

    intercept(httpRequest: HttpRequest<any>, next: HttpHandler) {
      if (httpRequest.responseType === 'json') {
        // If the expected response type is JSON then handle it here.
        return this.handleJsonResponse(httpRequest, next);
      } else {
        return next.handle(httpRequest);
      }
    }

    private handleJsonResponse(httpRequest: HttpRequest<any>, next: HttpHandler) {
      // Override the responseType to disable the default JSON parsing.
      httpRequest = httpRequest.clone({responseType: 'text'});
      // Handle the response using the custom parser.
      return next.handle(httpRequest).pipe(map(event => this.parseJsonResponse(event)));
    }

    private parseJsonResponse(event: HttpEvent<any>) {
      if (event instanceof HttpResponse && typeof event.body === 'string') {
        return event.clone({body: this.jsonParser.parse(event.body)});
      } else {
        return event;
      }
    }
  }
  ```

- You can then implement your own custom JsonParser. Here is a custom JsonParser that has a special date reviver.

  - app/http-interceptors/custom-json-interceptor.ts

    ```
    @Injectable()
    export class CustomJsonParser implements JsonParser {
      parse(text: string): any {
        return JSON.parse(text, dateReviver);
      }
    }

    function dateReviver(key: string, value: any) {
      /* . . . */
    }
    ```

- You provide the CustomParser along with the CustomJsonInterceptor.
  - app/http-interceptors/index.ts
    ```
    { provide: HTTP_INTERCEPTORS, useClass: CustomJsonInterceptor, multi: true },
    { provide: JsonParser, useClass: CustomJsonParser },
    ```

### Caching requests

- Interceptors can handle requests by themselves, without forwarding to next.handle().

  - For example, you might decide to cache certain requests and responses to improve performance. You can delegate caching to an interceptor without disturbing your existing data services.

  - app/http-interceptors/caching-interceptor.ts)

    ```
    @Injectable()
    export class CachingInterceptor implements HttpInterceptor {
      constructor(private cache: RequestCache) {}

      intercept(req: HttpRequest<any>, next: HttpHandler) {
        // continue if not cacheable.
        if (!isCacheable(req)) { return next.handle(req); }

        const cachedResponse = this.cache.get(req);
        return cachedResponse ?
          of(cachedResponse) : sendRequest(req, next, this.cache);
      }
    }
    ```

    ```
    /**
    * Get server response observable by sending request to `next()`.
    * Will add the response to the cache on the way out.
    */
    function sendRequest(
      req: HttpRequest<any>,
      next: HttpHandler,
      cache: RequestCache): Observable<HttpEvent<any>> {
      return next.handle(req).pipe(
        tap(event => {
          // There may be other events besides the response.
          if (event instanceof HttpResponse) {
            cache.put(req, event); // Update the cache.
          }
        })
      );
    }
    ```

### Using interceptors to request multiple values

- The HttpClient.get() method normally returns an observable that emits a single value, either the data or an error. An interceptor can change this to an observable that emits multiple values.

- The following revised version of the CachingInterceptor optionally returns an observable that immediately emits the cached response, sends the request on to the package search API, and emits again later with the updated search results.

  ```
  // cache-then-refresh
  if (req.headers.get('x-refresh')) {
    const results$ = sendRequest(req, next, this.cache);
    return cachedResponse ?
      results$.pipe( startWith(cachedResponse) ) :
      results$;
  }
  // cache-or-fetch
  return cachedResponse ?
    of(cachedResponse) : sendRequest(req, next, this.cache);
  ```

## Tracking and showing request progress

- Sometimes applications transfer large amounts of data and those transfers can take a long time. File uploads are a typical example. You can give the users a better experience by providing feedback on the progress of such transfers.

- To make a request with progress events enabled, create an instance of `HttpRequest` with the `reportProgress` option set `true` to enable tracking of progress events.

  - app/uploader/uploader.service.ts (upload request)
    ```
    const req = new HttpRequest('POST', '/upload/file', file, {
      reportProgress: true
    });
    ```

- TIP:

  - Every progress event triggers change detection, so only turn them on if you need to report progress in the UI.

  - When using HttpClient.request() with an HTTP method, configure the method with `observe: 'events'` to see all events, including the progress of transfers.

- Next, pass this request object to the `HttpClient.request()` method, which returns an Observable of HttpEvents (the same events processed by interceptors).

  - app/uploader/uploader.service.ts (upload body)
    ```
    // The `HttpClient.request` API produces a raw event stream
    // which includes start (sent), progress, and response events.
    return this.http.request(req).pipe(
      map(event => this.getEventMessage(event, file)),
      tap(message => this.showProgress(message)),
      last(), // return last (completed) message to caller
      catchError(this.handleError(file))
    );
    ```

- The `getEventMessage` method interprets each type of `HttpEvent` in the event stream.

  - app/uploader/uploader.service.ts (getEventMessage)

    ```
    /** Return distinct message for sent, upload progress, & response events */
    private getEventMessage(event: HttpEvent<any>, file: File) {
      switch (event.type) {
        case HttpEventType.Sent:
          return `Uploading file "${file.name}" of size ${file.size}.`;

        case HttpEventType.UploadProgress:
          // Compute and show the % done:
          const percentDone = event.total ? Math.round(100 * event.loaded / event.total) : 0;
          return `File "${file.name}" is ${percentDone}% uploaded.`;

        case HttpEventType.Response:
          return `File "${file.name}" was completely uploaded!`;

        default:
          return `File "${file.name}" surprising upload event: ${event.type}.`;
      }
    }
    ```

## Optimizing server interaction with debouncing

- If you need to make an HTTP request in response to user input, it's not efficient to send a request for every keystroke. It's better to wait until the user stops typing and then send a request. This technique is known as debouncing.

  - app/package-search/package-search.component.html (search)

    ```
    <input type="text" (keyup)="search(getValue($event))" id="name" placeholder="Search"/>

    <ul>
      <li *ngFor="let package of packages$ | async">
        <b>{{package.name}} v.{{package.version}}</b> -
        <i>{{package.description}}</i>
      </li>
    </ul>
    ```

  - The type of $event.target is only EventTarget in the template. In the getValue() method, the target is cast to an HTMLInputElement to let type-safe have access to its value property.

    ```
    getValue(event: Event): string {
      return (event.target as HTMLInputElement).value;
    }
    ```

- The following snippet implements debouncing for this input using RxJS operators.

  - app/package-search/package-search.component.ts (excerpt)

    ```
    withRefresh = false;
    packages$!: Observable<NpmPackageInfo[]>;
    private searchText$ = new Subject<string>();

    search(packageName: string) {
      this.searchText$.next(packageName);
    }

    ngOnInit() {
      this.packages$ = this.searchText$.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(packageName =>
          this.searchService.search(packageName, this.withRefresh))
      );
    }

    constructor(private searchService: PackageSearchService) { }
    ```

    | RXJS OPERATORS         | DETAILS                                                               |
    | ---------------------- | --------------------------------------------------------------------- |
    | debounceTime(500)      | ⁠ Wait for the user to stop typing, which is 1/2 second in this case. |
    | distinctUntilChanged() | Wait until the search text changes.                                   |
    | switchMap()            | ⁠ Send the search request to the service.                             |

### Using the switchMap() operator

- The `switchMap()` operator takes a function argument that returns an Observable.

  - If a previous search request is still in-flight, such as when the network connection is poor, the operator cancels that request and sends a new one.

- NOTE:
  - `switchMap()` returns service responses in their original request order, even if the server returns them out of order.

## Security: XSRF protection

- Cross-Site Request Forgery (XSRF or CSRF) is an attack technique by which the attacker can trick an authenticated user into unknowingly executing actions on your website.

- HttpClient supports a common mechanism used to prevent XSRF attacks.

  - When performing HTTP requests, an interceptor reads a token from a cookie, by default XSRF-TOKEN, and sets it as an HTTP header, X-XSRF-TOKEN. Because only code that runs on your domain could read the cookie, the backend can be certain that the HTTP request came from your client application and not an attacker.

- HttpClient supports only the client half of the XSRF protection scheme. Your backend service must be configured to set the cookie for your page, and to verify that the header is present on all eligible requests. Failing to do so renders Angular's default protection ineffective.

### Configuring custom cookie/header names

- If your backend service uses different names for the XSRF token cookie or header, use `HttpClientXsrfModule.withOptions()` to override the defaults.

  ```
  imports: [
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'My-Xsrf-Cookie',
      headerName: 'My-Xsrf-Header',
    }),
  ],
  ```

## Testing HTTP requests

- As for any external dependency, you must mock the HTTP backend so your tests can simulate interaction with a remote server. The `@angular/common/http/testing` library makes it straightforward to set up such mocking.

### Setup for testing

- To begin testing calls to `HttpClient`, import the `HttpClientTestingModule` and the mocking controller, `HttpTestingController`, along with the other symbols your tests require.

  - app/testing/http-client.spec.ts (imports)

    ```
    // Http testing module and mocking controller
    import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

    // Other imports
    import { TestBed } from '@angular/core/testing';
    import { HttpClient, HttpErrorResponse } from '@angular/common/http';
    ```

- Then add the `HttpClientTestingModule` to the `TestBed` and continue with the setup of the _service-under-test_.

  - app/testing/http-client.spec.ts(setup)

    ```
    describe('HttpClient testing', () => {
      let httpClient: HttpClient;
      let httpTestingController: HttpTestingController;

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ HttpClientTestingModule ]
        });

        // Inject the http service and test controller for each test
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
      });
      /// Tests begin ///
    });
    ```

    - Now requests made in the course of your tests hit the testing backend instead of the normal backend.
    - This setup also calls TestBed.inject() to inject the HttpClient service and the mocking controller so they can be referenced during the tests.

### Expecting and answering requests

- Now you can write a test that expects a GET Request to occur and provides a mock response.

  - app/testing/http-client.spec.ts (HttpClient.get)

    ```
    it('can test HttpClient.get', () => {
      const testData: Data = {name: 'Test Data'};

      // Make an HTTP GET request
      httpClient.get<Data>(testUrl)
        .subscribe(data =>
          // When observable resolves, result should match test data
          expect(data).toEqual(testData)
        );

      // The following `expectOne()` will match the request's URL.
      // If no requests or multiple requests matched that URL
      // `expectOne()` would throw.
      const req = httpTestingController.expectOne('/data');

      // Assert that the request is a GET.
      expect(req.request.method).toEqual('GET');

      // Respond with mock data, causing Observable to resolve.
      // Subscribe callback asserts that correct data was returned.
      req.flush(testData);

      // Finally, assert that there are no outstanding requests.
      httpTestingController.verify();
    });
    ```

- The last step, verifying that no requests remain outstanding, is common enough for you to move it into an afterEach() step:

  ```
  afterEach(() => {
  // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });
  ```

#### Custom request expectations

- If matching by URL isn't sufficient, it's possible to implement your own matching function. For example, you could look for an outgoing request that has an authorization header:

  ```
  // Expect one request with an authorization header
  const req = httpTestingController.expectOne(
    request => request.headers.has('Authorization')
  );
  ```

  - As with the previous expectOne(), the test fails if 0 or 2+ requests satisfy this predicate.

#### Handling more than one request

- If you need to respond to duplicate requests in your test, use the match() API instead of expectOne(). It takes the same arguments but returns an array of matching requests. Once returned, these requests are removed from future matching and you are responsible for flushing and verifying them.

  ```
  // get all pending requests that match the given URL
  const requests = httpTestingController.match(testUrl);
  expect(requests.length).toEqual(3);

  // Respond to each request with different results
  requests[0].flush([]);
  requests[1].flush([testData[0]]);
  requests[2].flush(testData);
  ```

### Testing for errors

- You should test the app's defenses against HTTP requests that fail.

- Call request.flush() with an error message, as seen in the following example.

  ```
  it('can test for 404 error', () => {
    const emsg = 'deliberate 404 error';

    httpClient.get<Data[]>(testUrl).subscribe({
      next: () => fail('should have failed with the 404 error'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).withContext('status').toEqual(404);
        expect(error.error).withContext('message').toEqual(emsg);
      },
    });

    const req = httpTestingController.expectOne(testUrl);

    // Respond with mock error
    req.flush(emsg, { status: 404, statusText: 'Not Found' });
  });
  ```

- Alternatively, call request.error() with a ProgressEvent.

  ```
  it('can test for network error', done => {
    // Create mock ProgressEvent with type `error`, raised when something goes wrong
    // at network level. e.g. Connection timeout, DNS error, offline, etc.
    const mockError = new ProgressEvent('error');

    httpClient.get<Data[]>(testUrl).subscribe({
      next: () => fail('should have failed with the network error'),
      error: (error: HttpErrorResponse) => {
        expect(error.error).toBe(mockError);
        done();
      },
    });

    const req = httpTestingController.expectOne(testUrl);

    // Respond with mock error
    req.error(mockError);
  });
  ```

## Passing metadata to interceptors

- Many interceptors require or benefit from configuration. Consider an interceptor that retries failed requests. By default, the interceptor might retry a request three times, but you might want to override this retry count for particularly error-prone or sensitive requests.

- `HttpClient` requests contain a _context_ that can carry metadata about the request. This context is available for interceptors to read or modify, though it is not transmitted to the backend server when the request is sent. This lets applications or other interceptors tag requests with configuration parameters, such as how many times to retry a request.

### Creating a context token

- Angular stores and retrieves a value in the context using an `HttpContextToken`. You can create a context token using the `new` operator, as in the following example:

  - creating a context token

    ```
    export const RETRY_COUNT = new HttpContextToken(() => 3);
    ```

    - The lambda function () => 3 passed during the creation of the `HttpContextToken` serves two purposes:

      1. It lets TypeScript infer the type of this token: HttpContextToken<number> The request context is type-safe —reading a token from a request's context returns a value of the appropriate type.

      2. It sets the default value for the token. This is the value that the request context returns if no other value was set for this token. Using a default value avoids the need to check if a particular value is set.

### Setting context values when making a request

- When making a request, you can provide an `HttpContext` instance, in which you have already set the context values.

  - setting context values
    ```
    this.httpClient
      .get('/data/feed', {
        context: new HttpContext().set(RETRY_COUNT, 5),
      })
      .subscribe(results => {/* ... */});
    ```

### Reading context values in an interceptor

- Within an interceptor, you can read the value of a token in a given request's context with `HttpContext.get()`. If you have not explicitly set a value for the token, Angular returns the default value specified in the token.

  - reading context values in an interceptor

    ```
    import {retry} from 'rxjs';

    export class RetryInterceptor implements HttpInterceptor {
      intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const retryCount = req.context.get(RETRY_COUNT);

        return next.handle(req).pipe(
            // Retry the request a configurable number of times.
            retry(retryCount),
        );
      }
    }
    ```

### Contexts are mutable

- Unlike most other aspects of `HttpRequest` instances, the request context is mutable and persists across other immutable transformations of the request.

- This lets interceptors coordinate operations through the context. For instance, the RetryInterceptor example could use a second context token to track how many errors occur during the execution of a given request:

  - coordinating operations through the context

    ```
    import {retry, tap} from 'rxjs/operators';
    export const RETRY_COUNT = new HttpContextToken(() => 3);
    export const ERROR_COUNT = new HttpContextToken(() => 0);

    export class RetryInterceptor implements HttpInterceptor {
      intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const retryCount = req.context.get(RETRY_COUNT);

        return next.handle(req).pipe(
            tap({
                  // An error has occurred, so increment this request's ERROR_COUNT.
                error: () => req.context.set(ERROR_COUNT, req.context.get(ERROR_COUNT) + 1)
                }),
            // Retry the request a configurable number of times.
            retry(retryCount),
        );
      }
    }
    ```
