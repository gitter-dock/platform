<?php declare(strict_types=1);

namespace Shopware\Core\Framework\Snippet\Services;

use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Symfony\Component\Translation\MessageCatalogueInterface;

interface SnippetServiceInterface
{
    /**
     * @param Criteria $criteria
     *
     * @return array
     */
    public function getList(Criteria $criteria): array;

    /**
     * @param MessageCatalogueInterface $catalog
     * @param Context                   $context
     *
     * @return array
     */
    public function getStorefrontSnippets(MessageCatalogueInterface $catalog, Context $context): array;
}
