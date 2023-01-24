# HRnet

[!typescript]
![reactjs]
[reactrouter]
[html]
[css]
[eslint]
[prettier]

Welcome to HRnet! This is our company's internal application to create and view employee records.

[**HRnet Live**](https://pcourant.github.io/PierreCourant_14_14112022/)

## Prerequisites:

- [pnpm](https://pnpm.io/installation)

## Installation:

```bash
git clone https://github.com/pcourant/PierreCourant_14_14112022.git hrnet
cd hrnet
pnpm install
```

Then,

```bash
pnpm dev
```

or

```bash
pnpm build && pnpm preview
```

Finally, open a tab on your local browser to the URL given by Vite

## Performance testing

Before testing performance you'll need to deactivate the mocking server.

In,

```bash
/src/main.tsx

```

Change :

```javascript
if (import.meta.env.MODE === 'production')
  import('./MockServer').then((MockServer) => MockServer.default());
```

TO

```javascript
//if (import.meta.env.MODE === 'production')
//  import('./MockServer').then((MockServer) => MockServer.default());
```

## Author

Pierre COURANT


[typescript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[reactjs]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[reactrouter]: https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white
[html]: https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white
[css]: https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white
[eslint]: https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white
[prettier]: https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E
