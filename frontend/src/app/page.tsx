import {
  CheckCircle2,
  Coffee,
  DatabaseZap,
  Palette,
  Shapes,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Badge } from "@/shared/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { AppShell, PageContainer } from "@/shared/ui/layout/AppShell";
import {
  ResponsiveGrid,
  Section,
  Stack,
} from "@/shared/ui/layout/LayoutPrimitives";
import { PageHeader } from "@/shared/ui/layout/PageHeader";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/ui/states/StandardStates";
import { FoundationNotificationButton } from "./_components/FoundationNotificationButton";

export default async function HomePage() {
  const translate = await getTranslations("common");

  const foundations = [
    {
      description: translate("TXT_TOKEN_CARD_DESCRIPTION"),
      icon: Palette,
      title: translate("TXT_TOKEN_CARD_TITLE"),
    },
    {
      description: translate("TXT_UI_CARD_DESCRIPTION"),
      icon: Shapes,
      title: translate("TXT_UI_CARD_TITLE"),
    },
    {
      description: translate("TXT_DATA_CARD_DESCRIPTION"),
      icon: DatabaseZap,
      title: translate("TXT_DATA_CARD_TITLE"),
    },
  ];

  return (
    <AppShell
      header={
        <PageContainer className="flex items-center gap-3 py-4">
          <span className="border-border bg-primary grid size-11 place-items-center rounded-full border-2">
            <Coffee aria-hidden="true" className="size-6" />
          </span>
          <strong>{translate("TXT_APP_NAME")}</strong>
        </PageContainer>
      }
    >
      <PageContainer className="space-y-12">
        <PageHeader
          eyebrow={translate("TXT_FOUNDATION_EYEBROW")}
          title={translate("TXT_FOUNDATION_TITLE")}
          description={translate("TXT_FOUNDATION_DESCRIPTION")}
          actions={<FoundationNotificationButton />}
        />

        <Section aria-labelledby="foundation-components-title">
          <Stack className="gap-2">
            <h2 id="foundation-components-title">
              {translate("TXT_COMPONENTS_TITLE")}
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              {translate("TXT_COMPONENTS_DESCRIPTION")}
            </p>
          </Stack>
          <ResponsiveGrid>
            {foundations.map(({ description, icon: Icon, title }) => (
              <Card key={title}>
                <CardHeader>
                  <Badge className="border-border bg-secondary text-foreground mb-3 size-fit border-2">
                    <CheckCircle2 aria-hidden="true" />
                  </Badge>
                  <CardTitle className="flex items-center gap-2">
                    <Icon aria-hidden="true" className="size-5" />
                    {title}
                  </CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </ResponsiveGrid>
        </Section>

        <Section aria-labelledby="foundation-states-title">
          <h2 id="foundation-states-title">{translate("TXT_STATES_TITLE")}</h2>
          <ResponsiveGrid>
            <LoadingState
              title={translate("TXT_LOADING_TITLE")}
              description={translate("TXT_LOADING_DESCRIPTION")}
            />
            <EmptyState
              title={translate("TXT_EMPTY_TITLE")}
              description={translate("TXT_EMPTY_DESCRIPTION")}
            />
            <ErrorState
              title={translate("TXT_ERROR_TITLE")}
              description={translate("TXT_ERROR_DESCRIPTION")}
            />
          </ResponsiveGrid>
        </Section>
      </PageContainer>
    </AppShell>
  );
}
