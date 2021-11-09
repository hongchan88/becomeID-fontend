# becomeID

anything can become ID to reach you .

## what is this project about?

Many things can represent you. such as, car plates number , address , location etc ..\
These things are publically recharble and visible by others and somehow these has data and information.\

people might want to reach you because your car is parked in wrong spot and want to message you \
"you parked in wrong spot!!" or something like "you have a flat tire! " , \
or live in particular area and some people want to know about your area etc\
or you might want to ask your neighbours if they have spare double AA battery that \
you need it right now for my work .\

I thought this app could change lives of people by connectting each other \

and you can stay to be anonymous.

1. car plates ( feature added)
2. address
3. location

## becomeId back end

To view becomeID-backend with Prisma + Apollo + Graphql **[click here](https://github.com/hongchan88/becomeID-backend)**.

## becomeID frontend

- [x] reactive variables for logged in user auth\
- [x] styled-component -> styled reset , global style\

- [x] Navigation ( home / register Id / find & connect / message rooms)\
- [x] search component in find & connect\
- [x] save token on localstroage and http headers

- [x] useQuery , useMutation from apollo
- [x] use subscrition to listen to incoming message and modify chache to paint msg on chat box
- [x] seerooms ( message tab) to find rooms that logged in user has relation to
-

## live chatting function

- [x] apollo subscription\
- [x] message write fragment in cache , modify cache\
- [] delete chat room function
