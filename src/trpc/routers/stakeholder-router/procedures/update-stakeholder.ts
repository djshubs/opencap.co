import { Audit } from "@/server/audit";
import { withAccessControl } from "@/trpc/api/trpc";
import { ZodUpdateStakeholderMutationSchema } from "./../schema";

export const updateStakeholderProcedure = withAccessControl
  .meta({ policies: { stakeholder: { allow: ["update"] } } })
  .input(ZodUpdateStakeholderMutationSchema)
  .mutation(
    async ({
      ctx: {
        session,
        db,
        requestIp,
        userAgent,
        membership: { companyId },
      },
      input,
    }) => {
      try {
        const { id: stakeholderId, ...rest } = input;
        const user = session.user;

        await db.$transaction(async (tx) => {
          const updated = await tx.stakeholder.update({
            where: {
              id: stakeholderId,
              companyId,
            },
            data: {
              ...rest,
            },
            select: {
              id: true,
              name: true,
            },
          });

          await Audit.create(
            {
              action: "stakeholder.updated",
              companyId: user.companyId,
              actor: { type: "user", id: user.id },
              context: {
                requestIp,
                userAgent,
              },
              target: [{ type: "stakeholder", id: updated.id }],
              summary: `${user.name} updated detailes of stakeholder : ${updated.name}`,
            },
            tx,
          );
        });

        return {
          success: true,
          message: "Successfully updated the stakeholder",
        };
      } catch (error) {
        console.log(error);
        return {
          success: false,
          message: "Something went up. Please try again later",
        };
      }
    },
  );
