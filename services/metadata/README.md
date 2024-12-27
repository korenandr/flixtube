## Metadata service

This service responsible for saving and retrieving information about saved videos in storage.

## Run tests options

There are two different types of tests you can run locally (it`s also used in CI pipeline):

Unit tests:

```bash
npm run test:unit
```

Integration tests:

```bash
docker compose up -d --wait
npm run test:integration
```
